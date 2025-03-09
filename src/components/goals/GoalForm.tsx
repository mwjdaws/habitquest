
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateGoalData, KeyResult } from '@/hooks/useGoals';
import { useGoals } from '@/hooks/useGoals';
import { FormField } from './FormField';
import { DatePickerField } from './DatePickerField';
import { KeyResultsList } from './KeyResultsList';
import { formatInTorontoTimezone, getCurrentTorontoDate } from '@/lib/dateUtils';

interface GoalFormProps {
  onGoalCreated: () => void;
  onCancel: () => void;
}

export function GoalForm({ onGoalCreated, onCancel }: GoalFormProps) {
  const { createGoal } = useGoals();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(getCurrentTorontoDate());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [keyResults, setKeyResults] = useState<(Omit<KeyResult, 'id'> & { temp_id: string })[]>([
    { temp_id: Date.now().toString(), description: '', target_value: 100, current_value: 0, habit_id: null }
  ]);
  
  const [errors, setErrors] = useState({
    name: '',
    objective: '',
    startDate: '',
    endDate: '',
    keyResults: ['']
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      objective: '',
      startDate: '',
      endDate: '',
      keyResults: keyResults.map(() => '')
    };
    
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
      isValid = false;
    }
    
    if (!objective.trim()) {
      newErrors.objective = 'Objective is required';
      isValid = false;
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
      isValid = false;
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
      isValid = false;
    } else if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date must be after start date';
      isValid = false;
    }
    
    keyResults.forEach((kr, index) => {
      if (!kr.description.trim()) {
        newErrors.keyResults[index] = 'Description is required';
        isValid = false;
      }
      
      if (isNaN(kr.target_value) || kr.target_value <= 0) {
        newErrors.keyResults[index] = 'Target value must be a positive number';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleAddKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { temp_id: Date.now().toString(), description: '', target_value: 100, current_value: 0, habit_id: null }
    ]);
    
    setErrors(prev => ({
      ...prev,
      keyResults: [...prev.keyResults, '']
    }));
  };

  const handleRemoveKeyResult = (index: number) => {
    if (keyResults.length <= 1) return;
    
    const updatedKeyResults = keyResults.filter((_, i) => i !== index);
    setKeyResults(updatedKeyResults);
    
    setErrors(prev => {
      const updatedKeyResultErrors = [...prev.keyResults];
      updatedKeyResultErrors.splice(index, 1);
      return {
        ...prev,
        keyResults: updatedKeyResultErrors
      };
    });
  };

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: any) => {
    const updatedKeyResults = [...keyResults];
    updatedKeyResults[index] = {
      ...updatedKeyResults[index],
      [field]: field === 'target_value' ? parseFloat(value) || 0 : value
    };
    setKeyResults(updatedKeyResults);
    
    if (field === 'description' && value.trim() !== '') {
      setErrors(prev => {
        const updatedKeyResultErrors = [...prev.keyResults];
        updatedKeyResultErrors[index] = '';
        return {
          ...prev,
          keyResults: updatedKeyResultErrors
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const goalData: CreateGoalData = {
      name: name.trim(),
      objective: objective.trim(),
      start_date: startDate ? formatInTorontoTimezone(startDate, 'yyyy-MM-dd') : '',
      end_date: endDate ? formatInTorontoTimezone(endDate, 'yyyy-MM-dd') : '',
      key_results: keyResults.map(kr => ({
        description: kr.description.trim(),
        target_value: kr.target_value,
        current_value: kr.current_value,
        habit_id: kr.habit_id
      }))
    };
    
    const { success } = await createGoal(goalData);
    
    setIsSubmitting(false);
    
    if (success) {
      onGoalCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormField
          id="goal-name"
          label="Goal Name"
          value={name}
          onChange={setName}
          placeholder="Enter your goal name"
          error={errors.name}
        />
        
        <FormField
          id="goal-objective"
          label="Objective"
          value={objective}
          onChange={setObjective}
          placeholder="Describe the objective of your goal"
          error={errors.objective}
          multiline
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            label="Start Date"
            date={startDate}
            onDateChange={setStartDate}
            error={errors.startDate}
          />
          
          <DatePickerField
            label="End Date"
            date={endDate}
            onDateChange={setEndDate}
            error={errors.endDate}
            minDate={startDate}
          />
        </div>
        
        <KeyResultsList
          keyResults={keyResults}
          errors={errors.keyResults}
          onAddKeyResult={handleAddKeyResult}
          onRemoveKeyResult={handleRemoveKeyResult}
          onKeyResultChange={handleKeyResultChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Goal
        </Button>
      </div>
    </form>
  );
}
