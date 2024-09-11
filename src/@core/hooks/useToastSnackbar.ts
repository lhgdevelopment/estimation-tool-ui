import { OptionsWithExtraProps, SnackbarMessage, useSnackbar } from 'notistack'

export const useToastSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const showSnackbar = (
    message: SnackbarMessage,
    otherProp: OptionsWithExtraProps<any> = {} as OptionsWithExtraProps<any>
  ) => {
    const defaultOptions: OptionsWithExtraProps<any> = {
      variant: 'default', // Example: default variant can be 'default'
      autoHideDuration: 1000, // Example: default duration of 10 seconds
      ...otherProp // Overwrite with passed options
    }

    enqueueSnackbar(message, defaultOptions)
  }

  return { showSnackbar, closeSnackbar }
}
