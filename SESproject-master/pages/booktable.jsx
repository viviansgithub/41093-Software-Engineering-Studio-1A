import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '../styles/booktable.module.css'
import Navi from '../components/Custnav'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const booktable = ({ bookings }) => {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [timeWarn, setTimeWarn] = useState(false)
    const [showSubmit, setSubmit] = useState(false)
    let change = false
    let date
    let time

    // const [popup, setpopup] = useState(false)

    useEffect(() => {
        document.getElementById("date").setAttribute("min", MinDate())
    })

    function MinDate() {
        let today_date = new Date()
        today_date.setDate(today_date.getDate() + 14)
        return today_date.toISOString().slice(0, 10) //2013-03-10T02:00:00Z
    }


    function onDateChange() {
        setSubmit(false)
        document.getElementById("table").disabled = true
        document.getElementById("table").value = "select table"
        document.getElementById("person").disabled = true
        if (change == false) {
            document.getElementById("time").disabled = false
            change = true
        }
    }

    function onTimeChange() {
        setSubmit(false)
        setTimeWarn(false)
        time = document.getElementById("time").value.slice(0, 2)
        date = document.getElementById("date").value
        if (time < 12 || time > 21) {
            setTimeWarn(true)
            return
        }
        document.getElementById("table").value = "select table"
        setShow(false)
        for (let i = 1; i < 7; i++) {
            document.getElementById(`table ${i}`).disabled = false
        }
        let count = 0;
        document.getElementById("table").disabled = false;
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].date == date && bookings[i].time == time) {
                document.getElementById(`${bookings[i].table}`).disabled = true
                count++
            }
        }
        if (count == 6)
            setShow(true)
    }

    function onTableChange() {
        document.getElementById("person").disabled = false
        setSubmit(true)
    }


    async function onSubmit(event) {
        event.preventDefault()
        let cont = true;
        if (time < 12 || time > 21) {
            setTimeWarn(true)
            return
        }
        const MDate = event.target.date.value
        const MTime = event.target.time.value.slice(0, 2)
        const table = event.target.table.value;
        const persons = event.target.person.value;

        if (cont) {
            const res = await fetch(
                `http://localhost:5000/bookings`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name: sessionStorage.getItem("name"),
                        email: sessionStorage.getItem("email"),
                        date: MDate,
                        time: MTime,
                        table: table,
                        numberofpeople: persons,
                        personId: sessionStorage.getItem("id")
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (res.status == 201) {
                toast.success('Booking Successful!', { position: toast.POSITION.TOP_CENTER })
                router.push("/custhome")
            }
        }
    }


    return (
        <div className="container-form">
            <Navi></Navi>
            <div className={styles.center}>
                <h1>Reservation online</h1>
                {timeWarn ? <p>Please select a time between 12 PM and 9 PM</p> : null}
                {show ? <p>All tables taken for this time</p> : null}
                <form className={styles.bookform} onSubmit={onSubmit}>
                <p>Times are only booked by the hour</p>
                    <table className={styles.booktable}>
                        <tbody>
                            <tr>
                                <td><label htmlFor="Date">Date</label></td>
                                <td><input required type="Date" name="date" id="date" onChange={onDateChange} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="time">Time</label></td>
                                <td><input required type="time" id="time" name="time" min="12:00" max="21:00" disabled onChange={onTimeChange}></input></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="table">Table</label></td>
                                <td><select required name="table" id="table" onChange={onTableChange} disabled>
                                    <option value="table-select">select table</option>
                                    <option value="table 1" id="table 1">table 1</option>
                                    <option value="table 2" id="table 2">table 2</option>
                                    <option value="table 3" id="table 3">table 3</option>
                                    <option value="table 4" id="table 4">table 4</option>
                                    <option value="table 5" id="table 5">table 5</option>
                                    <option value="table 6" id="table 6">table 6</option>
                                </select></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="person">People number</label></td>
                                <td><select required name="person" id="person" disabled>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="5+">5+</option>
                                </select></td>
                            </tr>
                        </tbody>
                    </table>
                    {showSubmit ?
                        <input type="submit" value="Submit" id="submit" />
                        : null}
                </form>
            </div>
        </div>
    )
}
export async function getServerSideProps() {
    const res = await fetch(`http://localhost:5000/bookings`)
    const bookings = await res.json()
    return {
        props: { bookings },
    }
}


export default booktable
