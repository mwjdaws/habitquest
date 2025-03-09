
import { useState } from "react";
import { KeyResult, useGoals } from "@/hooks/useGoals";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link, Check, Plus, Minus } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";

interface KeyResultItemProps {
  keyResult: KeyResult;
  goalProgress: number;
  isGoalActive: boolean;
  onProgressChange?: (newProgress: number) => Promise<void>;
}

export function KeyResultItem({ keyResult, goalProgress, isGoalActive, onProgressChange }: KeyResultItemProps) {
  const { updateKeyResult } = useGoals();
  const { habits } = useHabits();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newValue, setNewValue] = useState(keyResult.current_value);
  
  const progress = Math.min(100, Math.round((keyResult.current_value / keyResult.target_value) * 100));
  const isComplete = progress >= 100;
  
  const linkedHabit = keyResult.habit_id 
    ? habits.find(h => h.id === keyResult.habit_id) 
    : null;
  
  const handleQuickUpdate = async (increment: boolean) => {
    if (!isGoalActive || isUpdating) return;
    
    setIsUpdating(true);
    
    const step = keyResult.target_value >= 100 ? 5 : 1;
    const updatedValue = increment
      ? Math.min(keyResult.current_value + step, keyResult.target_value)
      : Math.max(keyResult.current_value - step, 0);
    
    if (updatedValue === keyResult.current_value) {
      setIsUpdating(false);
      return;
    }
    
    await updateKeyResult(keyResult.id!, updatedValue);
    if (onProgressChange) {
      await onProgressChange(progress);
    }
    setIsUpdating(false);
  };
  
  const handleUpdate = async () => {
    if (newValue === keyResult.current_value || !isGoalActive) {
      setShowUpdateForm(false);
      return;
    }
    
    setIsUpdating(true);
    
    // Ensure value doesn't exceed target and is not negative
    const updatedValue = Math.min(
      Math.max(0, newValue), 
      keyResult.target_value
    );
    
    const { success } = await updateKeyResult(keyResult.id!, updatedValue);
    
    if (success) {
      setShowUpdateForm(false);
      if (onProgressChange) {
        const newProgress = Math.min(100, Math.round((updatedValue / keyResult.target_value) * 100));
        await onProgressChange(newProgress);
      }
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="p-3 bg-muted/40 rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1 flex-1">
          <div className="flex items-start gap-1">
            <span className="text-sm font-medium flex-1">{keyResult.description}</span>
            {isComplete && <Check className="h-4 w-4 text-green-500 mt-0.5" />}
          </div>
          
          {linkedHabit && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link className="h-3 w-3" />
              <span>Linked to: {linkedHabit.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1 text-xs">
          <span>Progress: {keyResult.current_value} / {keyResult.target_value}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      {isGoalActive && (
        <div className="mt-3">
          {showUpdateForm ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max={keyResult.target_value}
                value={newValue}
                onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
              />
              <Button 
                size="sm" 
                className="h-8 px-2" 
                onClick={handleUpdate} 
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Save
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2" 
                onClick={() => setShowUpdateForm(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {!isComplete && (
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => handleQuickUpdate(false)}
                    disabled={isUpdating || keyResult.current_value <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 ml-1"
                    onClick={() => handleQuickUpdate(true)}
                    disabled={isUpdating || keyResult.current_value >= keyResult.target_value}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7" 
                onClick={() => setShowUpdateForm(true)}
              >
                Update Value
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
