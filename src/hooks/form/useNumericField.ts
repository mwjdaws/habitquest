
import { useState, useCallback } from "react";

export function useNumericField() {
  const handleNumericChange = useCallback((field: any, e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
  }, []);

  return { handleNumericChange };
}
