
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskTagSelectProps {
  tag: string | undefined | null;
  onTagChange: (tag: string | undefined) => void;
  availableTags: string[];
}

// Extracted custom tag input component
function CustomTagInput({ 
  inputValue, 
  setInputValue, 
  handleCustomTagSubmit, 
  onCancel,
  handleKeyDown 
}: { 
  inputValue: string;
  setInputValue: (value: string) => void;
  handleCustomTagSubmit: () => void;
  onCancel: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}) {
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

// Extracted tag selector component
function TagSelector({
  tag,
  handleTagSelect,
  availableTags
}: {
  tag: string | null | undefined;
  handleTagSelect: (value: string) => void;
  availableTags: string[];
}) {
  return (
    <div className="flex flex-col space-y-2">
      <Select 
        value={tag || "no-tag"} 
        onValueChange={handleTagSelect}
      >
        <SelectTrigger id="taskTag" className="w-full">
          <SelectValue placeholder="Select or create a tag">
            {tag ? (
              <div className="flex items-center">
                <TagIcon className="mr-2 h-4 w-4" />
                {tag}
              </div>
            ) : (
              <span>Select or create a tag</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-tag">
            <span className="text-muted-foreground">No tag</span>
          </SelectItem>
          
          <SelectItem value="custom-tag">
            <div className="flex items-center text-primary">
              <TagIcon className="mr-2 h-4 w-4" />
              Create custom tag...
            </div>
          </SelectItem>
          
          {availableTags.length > 0 && availableTags.map((tagName) => (
            <SelectItem key={tagName} value={tagName}>
              <div className="flex items-center">
                <TagIcon className="mr-2 h-4 w-4" />
                {tagName}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function TaskTagSelect({ tag, onTagChange, availableTags }: TaskTagSelectProps) {
  const [customTagMode, setCustomTagMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (tag) {
      setInputValue(tag);
      setCustomTagMode(!availableTags.includes(tag) && tag !== "no-tag");
    } else {
      setInputValue('');
      setCustomTagMode(false);
    }
  }, [tag, availableTags]);
  
  const handleTagSelect = (value: string) => {
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
  
  const handleCustomTagSubmit = () => {
    if (inputValue.trim()) {
      onTagChange(inputValue.trim());
      setCustomTagMode(false); // Exit custom tag mode after saving
    } else {
      onTagChange(undefined);
      setCustomTagMode(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomTagSubmit();
    }
  };

  const handleCancelCustomTag = () => {
    setCustomTagMode(false);
    if (!tag || tag === "no-tag") {
      setInputValue('');
    } else {
      setInputValue(tag);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="taskTag">Tag (Optional)</Label>
      
      {customTagMode ? (
        <CustomTagInput 
          inputValue={inputValue}
          setInputValue={handleInputChange}
          handleCustomTagSubmit={handleCustomTagSubmit}
          onCancel={handleCancelCustomTag}
          handleKeyDown={handleKeyDown}
        />
      ) : (
        <TagSelector 
          tag={tag}
          handleTagSelect={handleTagSelect}
          availableTags={availableTags}
        />
      )}
      
      {tag && !customTagMode && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            onTagChange(undefined);
            setInputValue("");
          }}
          className="mt-1"
        >
          Clear tag
        </Button>
      )}
    </div>
  );
}
