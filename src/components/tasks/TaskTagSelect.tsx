
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
  const [inputValue, setInputValue] = useState(tag === "no-tag" ? "" : (tag || ""));
  
  // Update input value when the tag prop changes
  useEffect(() => {
    setInputValue(tag === "no-tag" ? "" : (tag || ""));
  }, [tag]);
  
  // Handle input change separately from tag selection
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value) {
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
          value={tag} 
          onValueChange={onTagChange}
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
            {/* Option to clear the tag - use "no-tag" instead of empty string */}
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
            onChange={(e) => handleInputChange(e.target.value)}
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
