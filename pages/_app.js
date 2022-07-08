import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import {MoralisProvider} from 'react-moralis'
import App from 'next/app'
import { AmazonProvider } from '../context/AmazonContext'
import { ModalProvider } from 'react-simple-hook-modal'

// const AppId = process.env.NEXT_PUBLIC_MORALIS_SERVER
// const ServerUrl=process.env.NEXT_PUBLIC_MORALIS_APP_ID
// console.log("App ID: ", AppId, " ServerUrl: ", ServerUrl)

// function MyApp({ Component, pageProps }: AppProps) {
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <MoralisProvider
        // serverUrl={`${process.env.NEXT_PUBLIC_MORALIS_SERVER}`}  
        // appId={`${process.env.NEXT_PUBLIC_MORALIS_APP_ID}`}
        serverUrl={'https://vb1xoxbywv7i.usemoralis.com:2053/server'}
        appId={'wiwXEfK7g8IAWMFFgXaDqThTwOgKKcgjGSxu9fQQ'}
      >
        <AmazonProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </AmazonProvider>
      </MoralisProvider>
    
      {/* <div>{process.env.NEXT_PUBLIC_MORALIS_SERVER}</div>s */}
    </div>
  )
}

export default MyApp
