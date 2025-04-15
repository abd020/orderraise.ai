import React from 'react';
import { useStore } from '@/lib/store';
import { Send, Bot, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  items?: {
    name: string;
    quantity: string;
    supplier: string;
  }[];
  orderNumbers?: string[];
  expectedDelivery?: string;
}

export function SupplierChat() {
  const { inventory } = useStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const chatRef = React.useRef<HTMLDivElement>(null);

  const addMessage = (message: Partial<Message> & { text: string; sender: 'user' | 'ai' }) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...message,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({ text: input, sender: 'user' });
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      if (input.toLowerCase().includes('order')) {
        addMessage({
          text: "I'll help you place the order for your supplies:",
          sender: 'ai',
          items: [
            { name: '🥩 Beef (5kg)', quantity: '5kg', supplier: 'Premium Meats' },
            { name: '🥕 Carrots (10kg)', quantity: '10kg', supplier: 'Fresh Produce Co.' },
            { name: '🧅 Onions (8kg)', quantity: '8kg', supplier: 'Fresh Produce Co.' },
            { name: '🫑 Peppers (5kg)', quantity: '5kg', supplier: 'Fresh Produce Co.' },
          ],
        });
      } else if (input.toLowerCase().includes('yes')) {
        addMessage({
          text: "✅ I've placed the following orders:",
          sender: 'ai',
          orderNumbers: ['#1234 with Premium Meats', '#5678 with Fresh Produce Co.'],
          expectedDelivery: 'Tomorrow by 10 AM',
        });
      } else {
        addMessage({
          text: "I can help you place orders with suppliers. Just type 'order' and I'll suggest what needs to be ordered based on current inventory levels.",
          sender: 'ai',
        });
      }
    }, 1000);
  };

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    // Initial AI greeting
    if (messages.length === 0) {
      addMessage({
        text: 'Our AI agents automatically plan orders to your suppliers, ask you for confirmation, and follow up with them until the order is delivered. They log everything for you to have a clear view of your stock.',
        sender: 'ai',
      });
    }
  }, []);

  return (
    <div className="flex h-[600px] flex-col rounded-lg bg-white shadow-lg">
      <div className="flex items-center border-b px-6 py-4">
        <Bot className="mr-3 h-6 w-6 text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold">Replace chaotic emails and calls with suppliers using AI agents</h2>
          <p className="mt-1 text-sm text-gray-600">
            Our AI agents automatically plan orders to your suppliers, ask you for confirmation, and follow up with them until the order is delivered.
          </p>
        </div>
      </div>

      <div ref={chatRef} className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="mr-3 h-8 w-8 rounded-full bg-yellow-300 p-1" />
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="space-y-4">
                <p className="text-[15px]">{message.text}</p>
                
                {message.items && (
                  <div className="space-y-2">
                    {message.items.map((item, index) => (
                      <div key={index} className="text-[15px]">
                        {item.name} from {item.supplier}
                      </div>
                    ))}
                    <div className="mt-4">
                      <p className="mb-2">Would you like me to proceed with this order?</p>
                      <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                        <span>View full inventory dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}

                {message.orderNumbers && (
                  <div className="space-y-2">
                    {message.orderNumbers.map((order, index) => (
                      <div key={index} className="text-[15px]">
                        Order {order}
                      </div>
                    ))}
                    <p className="mt-2 text-[15px]">
                      Expected delivery: {message.expectedDelivery}
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <span>Track your orders</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex items-center space-x-4 px-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-[15px] focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}