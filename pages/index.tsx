import Main from '../components/Main'
import Sidebar from '../components/Sidebar'

const styles = {
  container: `h-full w-full flex`
}

const Home = () => {
  return (
    <div className={styles.container}>
      <Sidebar/>
      <Main/>
    </div>
  )
}

export default Home
