
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    if (!content) {
      throw new Error('Content is required');
    }

    // Simple sentiment analysis algorithm
    // This is a very basic implementation - in a production app, you might use a more sophisticated ML model
    const sentimentScore = analyzeSentiment(content);
    
    return new Response(
      JSON.stringify({ sentimentScore }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

/**
 * A simple sentiment analysis function
 * Returns a score between -1 and 1 where:
 * - Negative values indicate negative sentiment
 * - 0 indicates neutral sentiment
 * - Positive values indicate positive sentiment
 */
function analyzeSentiment(text: string): number {
  // List of positive and negative words
  const positiveWords = [
    'happy', 'joy', 'love', 'excellent', 'wonderful', 'great', 'good', 'awesome',
    'fantastic', 'delighted', 'pleased', 'glad', 'excited', 'cheerful', 'grateful',
    'thankful', 'satisfied', 'proud', 'confident', 'encouraged', 'motivated', 'inspired',
    'hopeful', 'optimistic', 'peaceful', 'calm', 'relaxed', 'accomplished', 'success'
  ];
  
  const negativeWords = [
    'sad', 'angry', 'hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointed',
    'frustrated', 'upset', 'worried', 'anxious', 'stressed', 'depressed', 'unhappy',
    'miserable', 'annoyed', 'irritated', 'afraid', 'scared', 'fearful', 'desperate',
    'hopeless', 'pessimistic', 'guilty', 'ashamed', 'regretful', 'lonely', 'failure'
  ];
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Count matches
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Check for positive words
  for (const word of positiveWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  }
  
  // Check for negative words
  for (const word of negativeWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  }
  
  // Calculate score (normalize between -1 and 1)
  if (positiveCount === 0 && negativeCount === 0) {
    return 0; // Neutral sentiment
  }
  
  const total = positiveCount + negativeCount;
  return (positiveCount - negativeCount) / total;
}
