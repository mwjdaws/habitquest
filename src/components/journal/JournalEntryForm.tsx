
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateJournalEntryData } from '@/lib/journalTypes';
import { QuickPromptCards } from './QuickPromptCards';

interface JournalEntryFormProps {
  onSave: (data: CreateJournalEntryData) => void;
  availableTags: string[];
  isSaving: boolean;
}

export function JournalEntryForm({ onSave, availableTags, isSaving }: JournalEntryFormProps) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSave({
      content: content.trim(),
      tag: tag,
    });
    
    // Reset form after submission
    setContent('');
    // Keep the tag selected for consecutive entries
  };
  
  const handleCreateTag = () => {
    if (newTag.trim()) {
      setTag(newTag.trim());
      setNewTag('');
      setIsAddingTag(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleSelectPrompt = (promptText: string, promptTag: string) => {
    setContent(promptText + "\n\n");
    setTag(promptTag);
    
    // Focus the textarea and place cursor at the end after the prompt
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = promptText.length + 2;
      textareaRef.current.selectionEnd = promptText.length + 2;
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <QuickPromptCards onSelectPrompt={handleSelectPrompt} />
          
          <div>
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind today?"
              className="min-h-32 mb-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">Ctrl</kbd> + <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">Enter</kbd> to save
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag">Tag (Optional)</Label>
            
            {isAddingTag ? (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTag();
                    } else if (e.key === 'Escape') {
                      setIsAddingTag(false);
                      setNewTag('');
                    }
                  }}
                />
                <Button onClick={handleCreateTag}>Add</Button>
                <Button variant="outline" onClick={() => setIsAddingTag(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select
                  value={tag || "no-tag"}
                  onValueChange={(value) => setTag(value === "no-tag" ? null : value)}
                >
                  <SelectTrigger id="tag" className="flex-1">
                    <SelectValue placeholder="Select a tag (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-tag">No tag</SelectItem>
                    {availableTags.map((t) => (
                      <SelectItem key={t} value={t}>
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-2" />
                          {t}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsAddingTag(true)}
                  title="Create new tag"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {tag && (
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2" 
                  onClick={() => setTag(null)}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving || !content.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
