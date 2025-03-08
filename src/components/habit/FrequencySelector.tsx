
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { weekdays, FrequencyType } from "@/lib/habitTypes";

type FrequencySelectorProps = {
  frequency: string[];
  frequencyType: FrequencyType;
  onFrequencyChange: (days: string[]) => void;
  onFrequencyTypeChange: (type: FrequencyType) => void;
};

export function FrequencySelector({
  frequency,
  frequencyType,
  onFrequencyChange,
  onFrequencyTypeChange,
}: FrequencySelectorProps) {
  const handleFrequencyToggle = (day: string) => {
    if (frequency.includes(day)) {
      onFrequencyChange(frequency.filter((d) => d !== day));
    } else {
      onFrequencyChange([...frequency, day]);
    }
  };

  return (
    <div>
      <Label>Frequency</Label>
      <Tabs 
        value={frequencyType} 
        onValueChange={(value) => onFrequencyTypeChange(value as FrequencyType)}
        className="mt-2"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <p className="text-sm text-muted-foreground mt-2">
            This habit will be tracked every day
          </p>
        </TabsContent>
        
        <TabsContent value="weekly">
          <p className="text-sm text-muted-foreground mt-2">
            This habit will be tracked every Monday
          </p>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-7 gap-1 mt-2">
            {weekdays.map((day) => (
              <Button
                key={day}
                type="button"
                variant={frequency.includes(day) ? "default" : "outline"}
                className={`h-9 ${frequency.includes(day) ? "" : "border-dashed"}`}
                onClick={() => handleFrequencyToggle(day)}
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {frequency.length === 0
              ? "Please select at least one day"
              : `Track on selected days (${frequency.length} days)`}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
