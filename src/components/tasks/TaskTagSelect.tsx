
import { Button } from '@/components/ui/button';
import { CustomTagInput } from './tag-select/CustomTagInput';
import { TagSelector } from './tag-select/TagSelector';
import { useTagState } from './tag-select/useTagState';
import { TaskFormFieldWrapper } from './form-fields/TaskFormFieldWrapper';

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
    <TaskFormFieldWrapper
      id="taskTag"
      label="Tag (Optional)"
    >
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
    </TaskFormFieldWrapper>
  );
}
