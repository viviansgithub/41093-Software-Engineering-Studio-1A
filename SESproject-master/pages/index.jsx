import router from 'next/router'
import styles from '../styles/homepage.module.css'
export default function Home() {

  function loginClick() {
    router.push('/login');
  }

  function registerClick() {
    router.push('/register');
  }

  return (
    <div className={styles.homepage}>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet" />
      <div className={styles.box}>
        <h1 className={styles.le}>Le Bistrot d'Andre</h1>
        <button className={styles.but} onClick={registerClick}>Register</button>
        <br />
        <button className={styles.but} onClick={loginClick}>Login</button>
        {/* <img className={styles.back} src="background.png"></img> */}
      </div>
    </div>
  )
}
