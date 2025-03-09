
import { TagIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TagSelectorProps {
  tag: string | null | undefined;
  handleTagSelect: (value: string) => void;
  availableTags: string[];
}

export function TagSelector({
  tag,
  handleTagSelect,
  availableTags
}: TagSelectorProps) {
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
