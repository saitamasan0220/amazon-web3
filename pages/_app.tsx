import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {MoralisProvider} from 'react-moralis'
// require('dotenv').config()
import 'dotenv/config'
import App from 'next/app'

const AppId = process.env.NEXT_PUBLIC_MORALIS_SERVER
const ServerUrl=process.env.NEXT_PUBLIC_MORALIS_APP_ID
console.log("App ID: ", AppId, " ServerUrl: ", ServerUrl)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      // serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}  
      // appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
      serverUrl={ServerUrl}  
      appId={AppId}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
