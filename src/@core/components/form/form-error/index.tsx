import { get, UseFormReturn } from 'react-hook-form'
interface AppFormErrorProps {
  name: string
  hookForm: UseFormReturn<any, any>
  className?: string
}

export default function AppFormError({ hookForm, name, className }: AppFormErrorProps) {
  const {
    formState: { errors }
  } = hookForm

  const error = get(errors || {}, name)

  return (
    <>
      {(!!error?.message || !!error?.root?.message) && (
        <span className={`text-xs text-red-600 dark-d:text-red-400 ${className}`}>
          {error?.message || error?.root?.message}
        </span>
      )}
    </>
  )
}
