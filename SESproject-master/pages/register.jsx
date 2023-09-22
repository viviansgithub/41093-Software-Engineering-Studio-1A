import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../styles/register.module.css'
const register = ({ users, staff }) => {
    const [show, setShow] = useState(false)
    const router = useRouter()


    async function onSubmit(event) {
        event.preventDefault()

        let cont = true
        const name = event.target.name.value
        const email = event.target.email.value
        const phone = event.target.phone.value
        const password = event.target.pwd.value

        for (const user of users) {
            if (user.email == email) {
                setShow(true)
                cont = false
                break
            }
        }
        for (const mem of staff) {
            if (mem.email == email) {
                setShow(true)
                cont = false
                break
            }
        }
        if (cont) {
            const res = await fetch(
                `http://localhost:5000/users`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        loyalty: 0,
                        password: password
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (res.status == 201) {
                sessionStorage.setItem("name", name)
                sessionStorage.setItem("email", email)
                router.push("/custhome")
            }

        }
    }

    return (
        <div className={styles.register}>
            <form className={styles.registerform} onSubmit={onSubmit}>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet" />
            <h1>Registration</h1>
            {show ? <p>Account already exists</p> : null}
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="name">Name</label></td>
                            <td><input required type="text" name="name" id="name"/></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="email">Email</label></td>
                            <td><input required type="email" id="email" name="email"></input></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="phone">Phone</label></td>
                            <td><input required type="tel" name="phone" id="phone"/></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="pwd">Password</label></td>
                            <td><input required type="password" id="pwd" name="pwd"></input></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`http://localhost:5000/users`)
    const users = await res.json()

    const resp = await fetch(`http://localhost:5000/staff`)
    const staff = await resp.json()
    return {
        props: { users, staff },
    }
}


export default register