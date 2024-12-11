import { OptionsWithExtraProps, SnackbarMessage, useSnackbar } from 'notistack'

export const useToastSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const showSnackbar = (
    message: SnackbarMessage,
    otherProp: OptionsWithExtraProps<any> = {} as OptionsWithExtraProps<any>
  ) => {
    const defaultOptions: OptionsWithExtraProps<any> = {
      variant: 'default',
      autoHideDuration: 1000,

      ...otherProp
    }

    enqueueSnackbar(message, defaultOptions)
  }

  return { showSnackbar, closeSnackbar }
}
