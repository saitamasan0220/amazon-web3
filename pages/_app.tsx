import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {MoralisProvider} from 'react-moralis'
// require('dotenv').config()
import 'dotenv/config'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}  
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
