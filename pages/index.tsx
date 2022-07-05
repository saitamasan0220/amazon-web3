// import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'

import Sidebar from '../components/Sidebar'

const styles = {
  container: `h-full w-full flex`
}

const Home = () => {
  return (
    <div className={styles.container}>
      <Sidebar/>
      {/* <Main/> */}
    </div>
  )
}

export default Home
