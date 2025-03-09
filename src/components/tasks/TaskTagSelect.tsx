
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

export function TaskTagSelect({ tag, onTagChange, availableTags }: TaskTagSelectProps) {
  // Track whether we're in custom input mode or select mode
  const [customTagMode, setCustomTagMode] = useState(false);
  // Track the input value for custom tags
  const [inputValue, setInputValue] = useState('');
  
  // When tag changes from parent, update our state
  useEffect(() => {
    if (tag) {
      setInputValue(tag);
      // If tag is not in available tags, we must be in custom mode
      setCustomTagMode(!availableTags.includes(tag) && tag !== "no-tag");
    } else {
      setInputValue('');
      setCustomTagMode(false);
    }
  }, [tag, availableTags]);
  
  // Handle tag selection from dropdown
  const handleTagSelect = (value: string) => {
    if (value === "no-tag") {
      onTagChange(undefined);
      setInputValue('');
      setCustomTagMode(false);
    } else if (value === "custom-tag") {
      setCustomTagMode(true);
      setInputValue('');
      // Don't change the tag yet - wait for user to type and confirm
    } else {
      onTagChange(value);
      setInputValue(value);
      setCustomTagMode(false);
    }
  };
  
  // Handle input change for custom tag
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };
  
  // Handle submission of custom tag
  const handleCustomTagSubmit = () => {
    if (inputValue.trim()) {
      onTagChange(inputValue.trim());
      setCustomTagMode(false); // Exit custom tag mode after saving
    } else {
      onTagChange(undefined);
      setCustomTagMode(false);
    }
  };
  
  // Handle keydown events on the input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomTagSubmit();
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="taskTag">Tag (Optional)</Label>
      
      {customTagMode ? (
        <div className="flex flex-col space-y-2">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="customTag"
              placeholder="Type your custom tag"
              value={inputValue}
              onChange={handleInputChange}
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
              onClick={() => {
                setCustomTagMode(false);
                if (!tag || tag === "no-tag") {
                  setInputValue('');
                } else {
                  setInputValue(tag);
                }
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        </div>
      ) : (
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
              {/* Option to clear the tag */}
              <SelectItem value="no-tag">
                <span className="text-muted-foreground">No tag</span>
              </SelectItem>
              
              {/* Option to create a custom tag */}
              <SelectItem value="custom-tag">
                <div className="flex items-center text-primary">
                  <TagIcon className="mr-2 h-4 w-4" />
                  Create custom tag...
                </div>
              </SelectItem>
              
              {/* Available tags from existing tasks */}
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
