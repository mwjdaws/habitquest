
import { useState, useRef, useEffect } from 'react';
import { getCurrentTorontoDate } from '@/lib/dateUtils';

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
    } else {
      // If empty, just close the tag input
      setIsAddingTag(false);
    }
  };
  
  const handleSelectPrompt = (promptText: string, promptTag: string) => {
    // Handle null or undefined promptText gracefully
    const textToInsert = promptText?.trim() ? promptText + "\n\n" : "";
    
    setContent(textToInsert);
    
    // Only set the tag if it's not empty
    if (promptTag?.trim()) {
      setTag(promptTag.trim());
    }
    
    // Focus the textarea and place cursor at the end after the prompt
    if (textareaRef.current) {
      textareaRef.current.focus();
      const cursorPosition = textToInsert.length;
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
      
      // Scroll to the cursor position
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };
  
  // Safely reset the form
  const resetForm = (keepTag: boolean = true) => {
    setContent('');
    if (!keepTag) {
      setTag(null);
    }
    setIsAddingTag(false);
    setNewTag('');
    
    // Focus the textarea again
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
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
    handleSelectPrompt,
    resetForm,
    // Add timestamp in Toronto timezone
    currentTimestamp: getCurrentTorontoDate()
  };
}
