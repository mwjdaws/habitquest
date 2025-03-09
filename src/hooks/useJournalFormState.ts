
import { useState, useRef, useEffect } from 'react';

export function useJournalFormState(initialTag: string | null = null) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<string | null>(initialTag);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleCreateTag = () => {
    if (newTag.trim()) {
      setTag(newTag.trim());
      setNewTag('');
      setIsAddingTag(false);
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
  
  return {
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
  };
}
