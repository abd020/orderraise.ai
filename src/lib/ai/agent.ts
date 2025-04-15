import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
import { WebBrowser } from 'langchain/tools/webbrowser';
import { supabase } from '../supabase/client';
import { openai } from './config';

// Custom tools for restaurant operations
const tools = [
  new Calculator(),
  new WebBrowser(),
  {
    name: 'inventory_check',
    description: 'Check current inventory levels and suggest reorder quantities',
    async func({ restaurant_id }: { restaurant_id: string }) {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('restaurant_id', restaurant_id);

      if (error) throw error;

      const lowStock = data.filter(item => item.current_stock <= item.minimum_stock);
      return {
        low_stock_items: lowStock,
        reorder_suggestions: lowStock.map(item => ({
          item: item.name,
          current: item.current_stock,
          minimum: item.minimum_stock,
          suggested_order: (item.minimum_stock - item.current_stock) * 1.5,
        })),
      };
    },
  },
  {
    name: 'order_analysis',
    description: 'Analyze order patterns and make predictions',
    async func({ restaurant_id, days = 30 }: { restaurant_id: string; days?: number }) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurant_id)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Analyze order patterns
      const ordersByDay = data.reduce((acc, order) => {
        const day = new Date(order.created_at).toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      // Calculate average daily orders
      const avgDailyOrders = Object.values(ordersByDay).reduce((sum: any, count: any) => sum + count, 0) / Object.keys(ordersByDay).length;

      return {
        total_orders: data.length,
        average_daily_orders: avgDailyOrders,
        peak_days: Object.entries(ordersByDay)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 3),
      };
    },
  },
  {
    name: 'staff_scheduling',
    description: 'Optimize staff scheduling based on historical data',
    async func({ restaurant_id }: { restaurant_id: string }) {
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('restaurant_id', restaurant_id);

      if (staffError) throw staffError;

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurant_id);

      if (ordersError) throw ordersError;

      // Analyze peak hours and suggest staffing levels
      const hourlyOrderCounts = orders.reduce((acc, order) => {
        const hour = new Date(order.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      return {
        peak_hours: Object.entries(hourlyOrderCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([hour, count]) => ({
            hour: parseInt(hour),
            order_count: count,
            suggested_staff: Math.ceil((count as number) / 10),
          })),
        staff_availability: staff.map(s => ({
          name: `${s.first_name} ${s.last_name}`,
          role: s.role,
          schedule: s.schedule,
        })),
      };
    },
  },
];

// Initialize the AI agent
export async function initializeAgent(restaurantId: string) {
  const model = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
  });

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'chat-conversational-react-description',
    verbose: true,
    maxIterations: 3,
    earlyStoppingMethod: 'generate',
  });

  return {
    async analyze(query: string) {
      const response = await executor.call({
        input: query,
        restaurant_id: restaurantId,
      });

      return response.output;
    },

    async generateResponse(messages: Array<{ role: string; content: string }>) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message;
    },

    async analyzeSentiment(text: string) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following text and provide a score from -1 (very negative) to 1 (very positive), along with key points.',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
      });

      return completion.choices[0].message;
    },
  };
}