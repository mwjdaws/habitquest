
import { useState } from "react";
import { FrequencySelector } from "@/components/habit/FrequencySelector";
import { FrequencyType } from "@/lib/habitTypes";

type HabitFrequencyFieldsProps = {
  frequency: string[];
  setFrequency: (frequency: string[]) => void;
};

export function HabitFrequencyFields({
  frequency,
  setFrequency
}: HabitFrequencyFieldsProps) {
  const getInitialFrequencyType = (): FrequencyType => {
    if (frequency.length === 0) return "daily";
    if (frequency.length === 7) return "daily";
    if (frequency.length === 1 && frequency.includes("monday")) return "weekly";
    return "custom";
  };
  
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(getInitialFrequencyType());

  const handleFrequencyTypeChange = (type: FrequencyType) => {
    setFrequencyType(type);
    
    if (type === "daily") {
      setFrequency([]);
    } else if (type === "weekly") {
      setFrequency(["monday"]);
    }
  };

  return (
    <FrequencySelector
      frequency={frequency}
      frequencyType={frequencyType}
      onFrequencyChange={setFrequency}
      onFrequencyTypeChange={handleFrequencyTypeChange}
    />
  );
}
