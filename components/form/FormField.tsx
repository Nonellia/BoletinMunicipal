import { formStyles } from "@/constants/estilos";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormField({ label, name, type, placeholder, required }: FormFieldProps) {
  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>{label}:</label>
      <input
        type={type}
        name={name}
        required={required}
        className={formStyles.input}
        placeholder={placeholder}
      />
    </div>
  );
}