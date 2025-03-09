
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Goal } from '@/hooks/useGoals';
import { FormField } from './FormField';
import { DatePickerField } from './DatePickerField';
import { toast } from '@/components/ui/use-toast';
import { formatInTorontoTimezone, toTorontoTime } from '@/lib/dateUtils';

interface GoalEditFormProps {
  goal: Goal;
  onSave: (
    goalId: string, 
    updates: { name: string; objective: string; start_date: string; end_date: string }
  ) => Promise<{ success: boolean }>;
  onCancel: () => void;
}

export function GoalEditForm({ goal, onSave, onCancel }: GoalEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(goal.name);
  const [objective, setObjective] = useState(goal.objective);
  const [startDate, setStartDate] = useState<Date | undefined>(
    goal.start_date ? toTorontoTime(new Date(goal.start_date)) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    goal.end_date ? toTorontoTime(new Date(goal.end_date)) : undefined
  );
  
  const [errors, setErrors] = useState({
    name: '',
    objective: '',
    startDate: '',
    endDate: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      objective: '',
      startDate: '',
      endDate: ''
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
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const goalData = {
      name: name.trim(),
      objective: objective.trim(),
      start_date: startDate ? formatInTorontoTimezone(startDate, 'yyyy-MM-dd') : '',
      end_date: endDate ? formatInTorontoTimezone(endDate, 'yyyy-MM-dd') : ''
    };
    
    const { success } = await onSave(goal.id, goalData);
    
    setIsSubmitting(false);
    
    if (success) {
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
      onCancel();
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
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Goal
        </Button>
      </div>
    </form>
  );
}
