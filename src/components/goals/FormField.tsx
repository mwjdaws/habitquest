
import { FormFieldComponent } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
    <FormFieldComponent
      id={id}
      label={label}
      error={error}
      description={description}
    >
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-destructive" : ""}
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
    </FormFieldComponent>
  );
}
