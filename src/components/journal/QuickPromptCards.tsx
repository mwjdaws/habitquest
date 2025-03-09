
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LightBulb, Star, BookOpen, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface JournalPrompt {
  id: string;
  text: string;
  tag: string;
}

interface QuickPromptCardsProps {
  onSelectPrompt: (text: string, tag: string) => void;
}

export function QuickPromptCards({ onSelectPrompt }: QuickPromptCardsProps) {
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('journal_prompts')
          .select('*');
        
        if (error) {
          console.error('Error fetching prompts:', error);
          return;
        }
        
        setPrompts(data || []);
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPrompts();
  }, []);
  
  // Get icon based on tag
  const getIconForTag = (tag: string) => {
    switch (tag) {
      case 'gratitude':
        return <Star className="h-4 w-4 mr-2" />;
      case 'reflection':
        return <BookOpen className="h-4 w-4 mr-2" />;
      case 'goals':
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'mood':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      default:
        return <LightBulb className="h-4 w-4 mr-2" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="min-w-[220px] max-w-[220px] bg-muted/30 animate-pulse">
            <CardContent className="p-4 h-[80px]"></CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (prompts.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Need inspiration?</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {prompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="min-w-[220px] max-w-[220px] hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onSelectPrompt(prompt.text, prompt.tag)}
          >
            <CardContent className="p-4">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                {getIconForTag(prompt.tag)}
                <span className="capitalize">{prompt.tag}</span>
              </div>
              <p className="text-sm">{prompt.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
