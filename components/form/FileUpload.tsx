import { formStyles } from "@/constants/estilos";

interface FileUploadProps {
  name: string;
  accept: string;
  label: string;
  hint: string;
  required?: boolean;
}

export default function FileUpload({ name, accept, label, hint, required }: FileUploadProps) {
  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>{label}:</label>
      <div className={formStyles.fileUpload.container}>
        <div className={formStyles.fileUpload.innerContainer}>
          <div className={formStyles.fileUpload.text}>
            <label className={formStyles.fileUpload.uploadLabel}>
              <span>Subir archivo</span>
              <input
                type="file"
                name={name}
                accept={accept}
                required={required}
                className={formStyles.fileUpload.input}
              />
            </label>
          </div>
          <p className={formStyles.fileUpload.hint}>{hint}</p>
        </div>
      </div>
    </div>
  );
}