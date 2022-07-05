import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {MoralisProvider} from 'react-moralis'
// require('dotenv').config()
// import 'dotenv/config'
import App from 'next/app'

const AppId = process.env.NEXT_PUBLIC_MORALIS_SERVER
const ServerUrl=process.env.NEXT_PUBLIC_MORALIS_APP_ID
console.log("App ID: ", AppId, " ServerUrl: ", ServerUrl)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <MoralisProvider
        // serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}  
        // appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
        // serverUrl={ServerUrl}  
        // appId={AppId}
        // serverUrl='https://vb1xoxbywv7i.usemoralis.com:2053/server'  
        // appId='wiwXEfK7g8IAWMFFgXaDqThTwOgKKcgjGSxu9fQQ'
        serverUrl={`${process.env.NEXT_PUBLIC_MORALIS_SERVER}`}  
        appId={`${process.env.NEXT_PUBLIC_MORALIS_APP_ID}`}
      >
        <Component {...pageProps} />
      </MoralisProvider>
    
      <div>{process.env.NEXT_PUBLIC_MORALIS_SERVER}</div>
    </div>
  )
}

export default MyApp
