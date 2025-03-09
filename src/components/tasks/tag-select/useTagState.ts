
import { useState, useEffect } from 'react';

export function useTagState(
  initialTag: string | undefined | null,
  availableTags: string[]
) {
  const [customTagMode, setCustomTagMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Initialize state based on the initial tag value
  useEffect(() => {
    if (initialTag) {
      setInputValue(initialTag);
      setCustomTagMode(!availableTags.includes(initialTag) && initialTag !== "no-tag");
    } else {
      setInputValue('');
      setCustomTagMode(false);
    }
  }, [initialTag, availableTags]);
  
  const handleTagSelect = (
    value: string,
    onTagChange: (tag: string | undefined) => void
  ) => {
    if (value === "no-tag") {
      onTagChange(undefined);
      setInputValue('');
      setCustomTagMode(false);
    } else if (value === "custom-tag") {
      setCustomTagMode(true);
      setInputValue('');
    } else {
      onTagChange(value);
      setInputValue(value);
      setCustomTagMode(false);
    }
  };
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };
  
  const handleCustomTagSubmit = (
    onTagChange: (tag: string | undefined) => void
  ) => {
    if (inputValue.trim()) {
      onTagChange(inputValue.trim());
      setCustomTagMode(false); // Exit custom tag mode after saving
    } else {
      onTagChange(undefined);
      setCustomTagMode(false);
    }
  };
  
  const handleKeyDown = (
    e: React.KeyboardEvent,
    onTagChange: (tag: string | undefined) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomTagSubmit(onTagChange);
    }
  };

  const handleCancelCustomTag = (tag: string | null | undefined) => {
    setCustomTagMode(false);
    if (!tag || tag === "no-tag") {
      setInputValue('');
    } else {
      setInputValue(tag);
    }
  };
  
  return {
    customTagMode,
    inputValue,
    setCustomTagMode,
    setInputValue,
    handleTagSelect,
    handleInputChange,
    handleCustomTagSubmit,
    handleKeyDown,
    handleCancelCustomTag
  };
}
