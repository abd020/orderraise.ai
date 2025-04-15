import { useState, useCallback } from 'react';
import { initializeAgent } from './agent';
import { supabase } from '../supabase/client';

export function useAIAgent(restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const agent = await initializeAgent(restaurantId);
      const analysis = await agent.analyze(
        'Analyze current inventory levels and suggest reorder quantities. Consider historical order data and seasonal trends.'
      );
      
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze inventory');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  const optimizeScheduling = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const agent = await initializeAgent(restaurantId);
      const analysis = await agent.analyze(
        'Optimize staff scheduling based on historical order patterns and current staff availability.'
      );
      
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize scheduling');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  const analyzeFeedback = useCallback(async (feedback: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const agent = await initializeAgent(restaurantId);
      const sentiment = await agent.analyzeSentiment(feedback);
      
      return sentiment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze feedback');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  const generateResponse = useCallback(async (context: string, customerMessage: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const agent = await initializeAgent(restaurantId);
      const response = await agent.generateResponse([
        { role: 'system', content: `You are a helpful restaurant assistant. Context: ${context}` },
        { role: 'user', content: customerMessage },
      ]);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate response');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  return {
    analyzeInventory,
    optimizeScheduling,
    analyzeFeedback,
    generateResponse,
    isLoading,
    error,
  };
}