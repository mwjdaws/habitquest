
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface CustomTagInputProps { 
  inputValue: string;
  setInputValue: (value: string) => void;
  handleCustomTagSubmit: () => void;
  onCancel: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function CustomTagInput({
  inputValue, 
  setInputValue, 
  handleCustomTagSubmit, 
  onCancel,
  handleKeyDown 
}: CustomTagInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex w-full items-center space-x-2">
        <Input
          id="customTag"
          placeholder="Type your custom tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
        <Button type="button" size="sm" onClick={handleCustomTagSubmit}>
          Save
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    </div>
  );
}
