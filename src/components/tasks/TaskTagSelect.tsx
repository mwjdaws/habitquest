
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CustomTagInput } from './tag-select/CustomTagInput';
import { TagSelector } from './tag-select/TagSelector';
import { useTagState } from './tag-select/useTagState';

interface TaskTagSelectProps {
  tag: string | undefined | null;
  onTagChange: (tag: string | undefined) => void;
  availableTags: string[];
}

export function TaskTagSelect({ tag, onTagChange, availableTags }: TaskTagSelectProps) {
  const {
    customTagMode,
    inputValue,
    handleTagSelect,
    handleInputChange,
    handleCustomTagSubmit,
    handleKeyDown,
    handleCancelCustomTag
  } = useTagState(tag, availableTags);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="taskTag">Tag (Optional)</Label>
      
      {customTagMode ? (
        <CustomTagInput 
          inputValue={inputValue}
          setInputValue={handleInputChange}
          handleCustomTagSubmit={() => handleCustomTagSubmit(onTagChange)}
          onCancel={() => handleCancelCustomTag(tag)}
          handleKeyDown={(e) => handleKeyDown(e, onTagChange)}
        />
      ) : (
        <TagSelector 
          tag={tag}
          handleTagSelect={(value) => handleTagSelect(value, onTagChange)}
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
            handleInputChange("");
          }}
          className="mt-1"
        >
          Clear tag
        </Button>
      )}
    </div>
  );
}
