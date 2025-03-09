
import { KeyResult } from '@/hooks/useGoals';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KeyResultForm } from './KeyResultForm';

interface KeyResultsListProps {
  keyResults: (Omit<KeyResult, 'id'> & { temp_id: string })[];
  errors: string[];
  onAddKeyResult: () => void;
  onRemoveKeyResult: (index: number) => void;
  onKeyResultChange: (index: number, field: keyof KeyResult, value: any) => void;
}

export function KeyResultsList({ 
  keyResults, 
  errors, 
  onAddKeyResult, 
  onRemoveKeyResult, 
  onKeyResultChange 
}: KeyResultsListProps) {
  return (
    <div className="pt-4 pb-2">
      <h3 className="text-lg font-medium mb-2">Key Results</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add measurable outcomes that will define the success of your goal
      </p>
      
      <div className="space-y-6">
        {keyResults.map((kr, index) => (
          <KeyResultForm
            key={kr.temp_id}
            keyResult={kr}
            index={index}
            errors={errors}
            onRemove={onRemoveKeyResult}
            onChange={onKeyResultChange}
            canRemove={keyResults.length > 1}
          />
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-1"
          onClick={onAddKeyResult}
        >
          <Plus className="h-4 w-4" />
          Add Another Key Result
        </Button>
      </div>
    </div>
  );
}
