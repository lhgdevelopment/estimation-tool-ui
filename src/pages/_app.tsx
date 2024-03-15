// ** Next Imports
import type { EmotionCache } from '@emotion/cache'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import { SnackbarProvider } from 'notistack'
import NProgress from 'nprogress'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import { Provider } from 'react-redux'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import AppLayout from 'src/layouts/AppLayout'

// ** Global css styles
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import '../../styles/app.css'
import '../../styles/globals.css'
import store from '../@core/store/store'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <AppLayout>{page}</AppLayout>)

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Head>
            <title>{`${themeConfig.templateName}`}</title>
            <meta name='description' content={`${themeConfig.templateName}`} />
            <meta name='keywords' content={`${themeConfig.templateName}`} />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>
          <SnackbarProvider autoHideDuration={1000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  // @ts-ignore
                  return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
