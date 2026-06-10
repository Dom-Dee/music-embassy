import { useId } from 'react'
import { formInputClass } from '../ui/FormField'

type FileUploadFieldProps = {
  label: string
  files: File[]
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export function FileUploadField({
  label,
  files,
  onChange,
  accept,
  multiple = true,
}: FileUploadFieldProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => onChange(Array.from(e.target.files ?? []))}
        className={`${formInputClass} cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-gold hover:file:bg-gold/22`}
      />
      {files.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-xs text-muted">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`} className="truncate text-fg">
              {file.name}{' '}
              <span className="text-muted">({Math.ceil(file.size / 1024)} KB)</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">
          PDF, audio, video, images, documents, and other file types up to 25 MB each.
        </p>
      )}
    </div>
  )
}
