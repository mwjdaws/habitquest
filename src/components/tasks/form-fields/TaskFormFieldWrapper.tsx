
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TaskFormFieldWrapperProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  description?: string;
}

export function TaskFormFieldWrapper({
  id,
  label,
  children,
  error,
  description
}: TaskFormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
