
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, PlusCircle } from 'lucide-react';

interface JournalTagSelectorProps {
  tag: string | null;
  setTag: (tag: string | null) => void;
  isAddingTag: boolean;
  setIsAddingTag: (isAdding: boolean) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleCreateTag: () => void;
  availableTags: string[];
}

export function JournalTagSelector({
  tag,
  setTag,
  isAddingTag,
  setIsAddingTag,
  newTag,
  setNewTag,
  handleCreateTag,
  availableTags
}: JournalTagSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="tag">Tag (Optional)</Label>
      
      {isAddingTag ? (
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter new tag"
            className="flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateTag();
              } else if (e.key === 'Escape') {
                setIsAddingTag(false);
                setNewTag('');
              }
            }}
          />
          <Button onClick={handleCreateTag}>Add</Button>
          <Button variant="outline" onClick={() => setIsAddingTag(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Select
            value={tag || "no-tag"}
            onValueChange={(value) => setTag(value === "no-tag" ? null : value)}
          >
            <SelectTrigger id="tag" className="flex-1">
              <SelectValue placeholder="Select a tag (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-tag">No tag</SelectItem>
              {availableTags.map((t) => (
                <SelectItem key={t} value={t}>
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-2" />
                    {t}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsAddingTag(true)}
            title="Create new tag"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {tag && (
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="gap-1">
            <Tag className="h-3 w-3" />
            {tag}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2" 
            onClick={() => setTag(null)}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
