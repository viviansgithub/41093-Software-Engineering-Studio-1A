import { useEffect, useState } from 'react'
import router from 'next/router'
import Navi from '../components/Staffnav'
import styles from '../styles/mtnone.module.css'
const mtnone = ({ staff }) => {

    const [mid, setId] = useState()
    const [member, setMember] = useState()
    const [show, setShow] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [warn, setWarn] = useState(false)
    let search = true

    useEffect(() => {
        setId(sessionStorage.getItem("mtnID"))
        if (search) {
            for (const mem of staff) {
                if (mid == mem.id) {
                    setMember(mem)
                    search = false
                    if (mem.id == "OmRDEe1")
                        setAdmin(true)
                    break
                }
            }
        }

    })

    const update = async (event) => {
        event.preventDefault()

        let count = 0
        let nName, nEmail, nPhone, nPwd, nRole
        const name = event.target.name.value
        const email = event.target.email.value
        const phone = event.target.phone.value
        const role = event.target.role.value
        const pwd = event.target.pwd.value

        if (name == "") { nName = member.name; count++ }
        else nName = name
        if (email == "") { nEmail = member.email; count++ }
        else nEmail = email
        if (phone == "") { nPhone = member.phone; count++ }
        else nPhone = phone
        if (pwd == "") { nPwd = member.password; count++ }
        else nPwd = pwd
        if (role == "") { nRole = member.role; count++ }
        else nRole = role

        if (count == 5) {
            setShow(true)
        }
        else {
            const res = await fetch(
                `http://localhost:5000/staff/${mid}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: nName,
                        email: nEmail,
                        phone: nPhone,
                        role: nRole,
                        password: nPwd
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (res.status == 200) {
                sessionStorage.removeItem("mtnID")
                router.push('/mtnstaff')
            }
            else {
                setShow(true)
            }
        }

    }

    const del = (event) => {
        event.preventDefault()
        if (mid == sessionStorage.getItem("id"))
            setWarn(true)
        else
            setConfirm(true)
    }

    const noDel = () => {
        setConfirm(false)
    }

    const yesDel = async () => {
        setConfirm(false)
        const res = await fetch(
            `http://localhost:5000/staff/${mid}`,
            {
                method: 'DELETE'
            }
        )
        if (res.status == 200) {
            sessionStorage.removeItem("mtnID")
            router.push('/mtnstaff')
        }
        else setShow(true)
    }

    const cancel = (event) => {
        event.preventDefault()
        sessionStorage.removeItem("mtnID")
        router.push('/mtnstaff')
    }

    return (
        <div className={styles.mtnone1}>
            <Navi></Navi>
            <div className={styles.center}>
                <h1>Maintain Staff Member</h1>
                {show ? <p>Something went wrong or no values were entered</p> : null}
                {warn ? <p>You cannot delete the account being currently used</p> : null} {/* Warning for deleting currently used account */}
                {admin ? <p>The admin account cannot be updated or deleted</p> : null}
                {confirm ?  //Warning for deleting member
                    <div>
                        <div className={styles.popup}>
                            <div className={styles.popuptext}>
                                <p>Are you sure you want to delete this member?</p>
                                <button onClick={yesDel}>Yes</button>
                                <button onClick={noDel}>No</button>
                            </div>
                        </div>
                    </div>
                    : null}
                {member ?
                    <form className={styles.mtnoneform} onSubmit={update}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="name">Name</label></td>
                                    <td><input type="text" name="name" id="name" placeholder={member.name} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="email">Email</label></td>
                                    <td><input type="email" id="email" name="email" placeholder={member.email} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="phone">Phone</label></td>
                                    <td><input type="tel" name="phone" id="phone" placeholder={member.phone} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="role">Role</label></td>
                                    <td><input type="text" name="role" id="role" placeholder={member.role} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="pwd">Password</label></td>
                                    <td><input type="password" id="pwd" name="pwd" placeholder={member.password} /></td>
                                </tr>
                            </tbody>
                        </table>
                        {!admin ?
                            <input id="sub" type="submit" value="Update" />
                            : null}
                        {!admin ?
                            <button id="del" onClick={del}>Delete</button>
                            : null}
                        <button onClick={cancel}>Cancel</button>
                    </form>
                    : <p>Member not found</p>}
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`http://localhost:5000/staff`)
    const staff = await res.json()
    return {
        props: { staff },
    }
}

export default mtnone
