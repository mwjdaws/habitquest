import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CreateJournalEntryData } from '@/lib/journalTypes';
import { QuickPromptCards } from './QuickPromptCards';
import { JournalTagSelector } from './JournalTagSelector';
import { useJournalFormState } from '@/hooks/useJournalFormState';

interface JournalEntryFormProps {
  onSave: (data: CreateJournalEntryData) => void;
  availableTags: string[];
  isSaving: boolean;
}

export function JournalEntryForm({ onSave, availableTags, isSaving }: JournalEntryFormProps) {
  const {
    content,
    setContent,
    tag,
    setTag,
    isAddingTag,
    setIsAddingTag,
    newTag,
    setNewTag,
    textareaRef,
    handleCreateTag,
    handleSelectPrompt
  } = useJournalFormState();
  
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
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
          
          <JournalTagSelector
            tag={tag}
            setTag={setTag}
            isAddingTag={isAddingTag}
            setIsAddingTag={setIsAddingTag}
            newTag={newTag}
            setNewTag={setNewTag}
            handleCreateTag={handleCreateTag}
            availableTags={availableTags}
          />
          
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
