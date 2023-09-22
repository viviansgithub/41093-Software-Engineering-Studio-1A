import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navi from '../components/Custnav'
import styles from '../styles/CustHome.module.css'
const Home = ({ users, bookings }) => {
    const [once, setOnce] = useState(true)
    const [email, setEmail] = useState()
    const router = useRouter()
    let today = new Date().toISOString().slice(0, 10)
    useEffect(() => {
        setEmail(sessionStorage.getItem("email"))
        if (email === null) {
            router.push('/')
            return
        }
        if (once == true && email != null) {
            let count = 0
            let user
            console.log(sessionStorage.getItem("email"))
            for (const cust of users) {
                if (sessionStorage.getItem("email") == cust.email) {
                    user = cust
                    sessionStorage.setItem("id", cust.id)
                }
            }
            for (const book of bookings) {
                if (book.personId == user.id && book.date < today){
                    count++
                }
            }
            count = Math.ceil(count / 4)
            if (count > 5) {
                count = 5
            }
            if (user.loyalty < count){
                updateLoy(count, user)
            }
            setOnce(false)
        }
    })

    async function updateLoy(count, user) {
        const res = await fetch(
            `http://localhost:5000/users/${user.id}`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    loyalty: count,
                    password: user.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    return (
        <div className={styles.Custhomepage}>
            <Navi></Navi>
            <h1 className={styles.le}>Welcome</h1>
            <div className={styles.imgcent}>
            <img className={styles.kit} src='/rest.jpg'></img>
            </div>
            <div className={styles.center}>
                <p>Le Bistrot d'Andre is a exquisite French restaurant and we take much pride in our food that we serve.
                    You will find your options as customer above at the top of the screen.
                </p>
            </div>
        </div>
    )
}

export async function getServerSideProps() {

    const resp = await fetch(`http://localhost:5000/users`)
    const users = await resp.json()

    const res = await fetch(`http://localhost:5000/bookings`)
    const bookings = await res.json()
    return {
        props: { users, bookings },
    }
}

export default Home