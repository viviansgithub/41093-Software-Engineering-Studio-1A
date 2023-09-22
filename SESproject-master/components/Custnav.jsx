import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/custnav.module.css'
const Nav = () => {
    const router = useRouter()
    const [email, setEmail] = useState()

    useEffect(() => {
        setEmail(sessionStorage.getItem("email"))
        if (email === null) router.push('/')
    })
    const logout = () => {
        sessionStorage.clear()
        router.push('/')
    }

    return (
        <nav className={styles.cnav}>
            <div className={styles.lk}>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet" />
                <h1>Le</h1>
                <Link href="/custhome"><a>Home</a></Link>
                <Link href="/updateCust"><a>Profile</a></Link>
                <Link href="/booktable"><a>Book</a></Link>
                <Link href="/viewbookings"><a>Bookings</a></Link>
                <Link href="/menu"><a>Menu</a></Link>
            </div>
            <button className={styles.cbtn} onClick={logout}>Logout</button>
        </nav>
    )
}

export default Nav