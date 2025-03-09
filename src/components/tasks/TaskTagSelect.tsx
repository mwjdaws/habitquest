
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
  return (
    <div className="space-y-2">
      <Label htmlFor="taskTag">Tag (Optional)</Label>
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
          
          {/* Option to create a new tag */}
          <div className="px-2 py-1.5">
            <Label htmlFor="newTag">Create new tag:</Label>
            <Input
              id="newTag"
              placeholder="Enter new tag"
              className="mt-1"
              value={tag === "no-tag" ? "" : (tag || "")}
              onChange={(e) => {
                if (e.target.value) {
                  onTagChange(e.target.value);
                } else {
                  onTagChange(undefined);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </SelectContent>
      </Select>
      {tag && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onTagChange(undefined)}
          className="mt-1"
        >
          Clear tag
        </Button>
      )}
    </div>
  );
}
