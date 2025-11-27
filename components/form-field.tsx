import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface IFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  register: ReturnType<UseFormRegister<any>>;
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  disabled,
  register,
}: IFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...register}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <p className="text-sm text-error-text">
          {error.message}
        </p>
      )}
    </div>
  );
}

