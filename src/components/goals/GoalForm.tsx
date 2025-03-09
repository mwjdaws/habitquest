
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Plus, Trash2, Link } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateGoalData, KeyResult } from '@/hooks/useGoals';
import { useGoals } from '@/hooks/useGoals';
import { useHabits } from '@/hooks/useHabits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GoalFormProps {
  onGoalCreated: () => void;
  onCancel: () => void;
}

export function GoalForm({ onGoalCreated, onCancel }: GoalFormProps) {
  const { createGoal } = useGoals();
  const { habits, loading: habitsLoading } = useHabits();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
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
    
    // Add an empty error string for the new key result
    setErrors(prev => ({
      ...prev,
      keyResults: [...prev.keyResults, '']
    }));
  };

  const handleRemoveKeyResult = (index: number) => {
    if (keyResults.length <= 1) return;
    
    const updatedKeyResults = keyResults.filter((_, i) => i !== index);
    setKeyResults(updatedKeyResults);
    
    // Remove the error for the deleted key result
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
    
    // Clear error for the updated field
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
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
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
        <div className="space-y-2">
          <Label htmlFor="goal-name">Goal Name</Label>
          <Input
            id="goal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your goal name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="goal-objective">Objective</Label>
          <Textarea
            id="goal-objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Describe the objective of your goal"
            className={cn("min-h-[100px]", errors.objective ? "border-red-500" : "")}
          />
          {errors.objective && <p className="text-red-500 text-sm">{errors.objective}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                    errors.startDate ? "border-red-500" : ""
                  )}
                >
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                    errors.endDate ? "border-red-500" : ""
                  )}
                >
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={date => !startDate || date < startDate}
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>
        </div>
        
        <div className="pt-4 pb-2">
          <h3 className="text-lg font-medium mb-2">Key Results</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add measurable outcomes that will define the success of your goal
          </p>
          
          <div className="space-y-6">
            {keyResults.map((kr, index) => (
              <div key={kr.temp_id} className="p-4 border rounded-md bg-muted/20">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium">Key Result #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveKeyResult(index)}
                    disabled={keyResults.length <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`kr-description-${index}`}>Description</Label>
                    <Input
                      id={`kr-description-${index}`}
                      value={kr.description}
                      onChange={(e) => handleKeyResultChange(index, 'description', e.target.value)}
                      placeholder="What will you achieve?"
                      className={errors.keyResults[index] ? "border-red-500" : ""}
                    />
                    {errors.keyResults[index] && (
                      <p className="text-red-500 text-sm">{errors.keyResults[index]}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`kr-target-${index}`}>Target Value</Label>
                      <Input
                        id={`kr-target-${index}`}
                        type="number"
                        min="1"
                        value={kr.target_value}
                        onChange={(e) => handleKeyResultChange(index, 'target_value', e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`kr-current-${index}`}>Current Value</Label>
                      <Input
                        id={`kr-current-${index}`}
                        type="number"
                        min="0"
                        max={kr.target_value}
                        value={kr.current_value}
                        onChange={(e) => handleKeyResultChange(index, 'current_value', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      Link to Habit (Optional)
                    </Label>
                    <Select
                      value={kr.habit_id || ""}
                      onValueChange={(value) => handleKeyResultChange(index, 'habit_id', value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a habit (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No habit linked</SelectItem>
                        {habitsLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          habits.map((habit) => (
                            <SelectItem key={habit.id} value={habit.id}>
                              {habit.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-1"
              onClick={handleAddKeyResult}
            >
              <Plus className="h-4 w-4" />
              Add Another Key Result
            </Button>
          </div>
        </div>
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
