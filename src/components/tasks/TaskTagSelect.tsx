
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskTagSelectProps {
  tag: string | undefined;
  onTagChange: (tag: string | undefined) => void;
  availableTags: string[];
}

export function TaskTagSelect({ tag, onTagChange, availableTags }: TaskTagSelectProps) {
  // Track the input value separately from the selected tag
  const [inputValue, setInputValue] = useState('');
  
  // When tag changes from parent component, update input if needed
  useEffect(() => {
    if (tag && tag !== "no-tag") {
      setInputValue(tag);
    } else if (tag === "no-tag") {
      setInputValue('');
    }
  }, [tag]);
  
  // Handle direct tag selection from dropdown
  const handleTagSelect = (value: string) => {
    if (value === "no-tag") {
      onTagChange(undefined);
      setInputValue('');
    } else {
      onTagChange(value);
      setInputValue(value);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update the tag if there's actual content
    if (value.trim()) {
      onTagChange(value);
    } else {
      onTagChange(undefined);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="taskTag">Tag (Optional)</Label>
      <div className="flex flex-col space-y-2">
        {/* Main Select component for choosing from existing tags */}
        <Select 
          value={tag || "no-tag"} 
          onValueChange={handleTagSelect}
        >
          <SelectTrigger id="taskTag" className="w-full">
            <SelectValue placeholder="Select or enter a tag">
              {tag ? (
                <div className="flex items-center">
                  <TagIcon className="mr-2 h-4 w-4" />
                  {tag}
                </div>
              ) : (
                <span>Select or enter a tag</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {/* Option to clear the tag */}
            <SelectItem value="no-tag">
              <span className="text-muted-foreground">No tag</span>
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
            
            {/* Custom tag input */}
            {tag && !availableTags.includes(tag) && tag !== "no-tag" && (
              <SelectItem value={tag}>
                <div className="flex items-center">
                  <TagIcon className="mr-2 h-4 w-4" />
                  {tag}
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        
        {/* Separate input for typing a custom tag */}
        <div className="flex w-full items-center space-x-2">
          <Input
            id="newTag"
            placeholder="Or type a new tag here"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1"
          />
        </div>
      </div>
      
      {tag && (
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
