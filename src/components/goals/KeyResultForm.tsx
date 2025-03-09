
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Link } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyResult } from '@/hooks/useGoals';
import { useHabits } from '@/hooks/useHabits';
import { Loader2 } from "lucide-react";

interface KeyResultFormProps {
  keyResult: Omit<KeyResult, 'id'> & { temp_id: string };
  index: number;
  errors: string[];
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof KeyResult, value: any) => void;
  canRemove: boolean;
}

export function KeyResultForm({ 
  keyResult, 
  index, 
  errors, 
  onRemove, 
  onChange, 
  canRemove 
}: KeyResultFormProps) {
  const { habits, loading: habitsLoading } = useHabits();
  
  return (
    <div className="p-4 border rounded-md bg-muted/20">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-medium">Key Result #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
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
            value={keyResult.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            placeholder="What will you achieve?"
            className={errors[index] ? "border-red-500" : ""}
          />
          {errors[index] && (
            <p className="text-red-500 text-sm">{errors[index]}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`kr-target-${index}`}>Target Value</Label>
            <Input
              id={`kr-target-${index}`}
              type="number"
              min="1"
              value={keyResult.target_value}
              onChange={(e) => onChange(index, 'target_value', e.target.value)}
              placeholder="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`kr-current-${index}`}>Current Value</Label>
            <Input
              id={`kr-current-${index}`}
              type="number"
              min="0"
              max={keyResult.target_value}
              value={keyResult.current_value}
              onChange={(e) => onChange(index, 'current_value', e.target.value)}
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
            value={keyResult.habit_id || "no_habit"}
            onValueChange={(value) => onChange(index, 'habit_id', value === "no_habit" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a habit (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_habit">No habit linked</SelectItem>
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
  );
}
