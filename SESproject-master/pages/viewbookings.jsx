import React, { useState, useEffect } from 'react'
import router from 'next/router'
import styles from '../styles/viewbookings.module.css'
import Navi from '../components/Custnav'

const viewbookings = ({ bookingusers }) => {

    const [bid, setId] = useState(false)
    const [bookid, setbookid] = useState()
    const [Confirm, setConfirm] = useState(false)
    const [show, setShow] = useState(false)

    const list = new Array()
    const list1 = new Array()

    var today_date = new Date()
    today_date.setDate(today_date.getDate() + 1)
    var t_day = today_date.toISOString().slice(0, 10)

    useEffect(() => {
        setId(sessionStorage.getItem("id"))
    })
    for (const user of bookingusers) {
        if (user.personId == bid) {
            if (t_day > user.date) {
                list.push(user)
            }
        }
    }

    for (const user of bookingusers) {
        if (user.personId == bid) {
            if (t_day <= user.date) {
                list1.push(user)
            }
        }

    }

    const Cancel = (bookingid) => {
        setbookid(bookingid)
        setConfirm(true)
    }
    const noCancel = () => {
        setConfirm(false)
    }

    const yesCancel = async () => {
        setConfirm(false)
        const res = await fetch(
            `http://localhost:5000/bookings/${bookid}`,
            {
                method: 'DELETE'
            }
        )
        if (res.status == 200)
            router.push('/viewbookings')
        else setShow(true)
    }

    return (
        <div className={styles.bookings}>
            <Navi></Navi>
            <div className={styles.center}>
                <h1>Bookings</h1>
                {/* <Link href="/custhome"><a>Back</a></Link> */}
                <h2>Current Bookings</h2>
                {Confirm ?
                    <div>
                        <div className={styles.popupvb}>
                            <div className={styles.popuptextvb}>
                                <p>Are you sure you want to cancel this booking?</p>
                                <button onClick={yesCancel}>Yes</button>
                                <button onClick={noCancel}>No</button>
                            </div>
                        </div>
                    </div>
                    : null}
                <table className={styles.currentbooking}>
                    <thead>
                        <tr><td>Date</td><td>Time</td><td>Table</td><td>Number Of People</td><td></td></tr>
                    </thead>
                    <tbody>
                        {list1.map((buser) => (
                            <tr key={buser.id}><td>{buser.date}</td>
                                <td>{buser.time + ":00"}</td><td>{buser.table}</td><td>{buser.numberofpeople}</td>
                                <td><button onClick={() => Cancel(buser.id)}>Cancel Booking</button></td></tr>
                        ))}
                    </tbody>
                </table>
                <h2>Previous Bookings</h2>
                {show ? <p>Couldn't Cancel the booking</p> : null}
                <table className={styles.previousbooking}>
                    <thead>
                        <tr><td>Date</td><td>Time</td><td>Table</td><td>Number Of People</td></tr>
                    </thead>
                    <tbody>
                        {list.map((buser) => (
                            <tr key={buser.id}><td>{buser.date}</td>
                                <td>{buser.time + ":00"}</td><td>{buser.table}</td><td>{buser.numberofpeople}</td></tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`http://localhost:5000/bookings`)
    const bookingusers = await res.json()
    return {
        props: { bookingusers },
    }
}
export default viewbookings
