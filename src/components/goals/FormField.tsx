
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error: string;
  multiline?: boolean;
  description?: string;
}

export function FormField({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  multiline,
  description
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("min-h-[100px]", error ? "border-destructive" : "")}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-destructive" : ""}
        />
      )}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
