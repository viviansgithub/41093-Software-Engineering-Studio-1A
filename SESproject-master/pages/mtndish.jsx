import { useEffect, useState } from 'react'
import router from 'next/router'
import Navi from '../components/Staffnav'
import axios from 'axios'
import styles from '../styles/mtndish.module.css'

const mtndish = ({ dishes }) => {
    const [mid, setId] = useState()
    const [dish, setDish] = useState()
    const [show, setShow] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('')
    let search = true

    useEffect(() => {
        setId(sessionStorage.getItem("dishID"))
        if (search) {
            for (const dish of dishes) {
                if (mid == dish.id) {
                    setDish(dish)
                    search = false
                    break
                }
            }
        }
    })

    const onChange = e => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const uploadFile = async () => {
        const formData = new FormData()
        formData.append('photo', file)
        const resp = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    const update = async (event) => {
        event.preventDefault()

        let count = 0
        let nName, nCat, nDesc, nPrice, nPhoto
        const name = event.target.name.value
        const cat = event.target.cat.value
        const desc = event.target.desc.value
        const price = event.target.price.value
        const photo = event.target.photo.value

        if (name == "") { nName = dish.name; count++ }
        else nName = name
        if (cat == "") { nCat = dish.category; count++ }
        else nCat = cat
        if (desc == "") { nDesc = dish.desc; count++ }
        else nDesc = desc
        if (price == "") { nPrice = dish.price; count++ }
        else nPrice = price
        if (filename == "") { nPhoto = dish.photoName; count++ }
        else nPhoto = filename

        if (count == 5) {
            setShow(true)
        }
        else {
            if (dish.photoName != filename && filename != "") uploadFile()
            const res = await fetch(
                `http://localhost:5000/dishes/${mid}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: nName,
                        category: nCat,
                        desc: nDesc,
                        price: nPrice,
                        photoName: nPhoto
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (res.status == 200) {
                sessionStorage.removeItem("dishID")
                router.push('/mtnmenu')
            }
            else {
                setShow(true)
            }
        }

    }

    const del = (event) => {
        event.preventDefault()
        setConfirm(true)
    }

    const noDel = () => {
        setConfirm(false)
    }

    const yesDel = async () => {
        setConfirm(false)
        const res = await fetch(
            `http://localhost:5000/dishes/${mid}`,
            {
                method: 'DELETE'
            }
        )
        if (res.status == 200) {
            sessionStorage.removeItem("dishID")
            router.push('/mtnmenu')
        }
        else setShow(true)
    }

    const cancel = (event) => {
        event.preventDefault()
        sessionStorage.removeItem("dishID")
        router.push('/mtnmenu')
    }

    return (
        <div className={styles.mtnd}>
            <Navi></Navi>
            <div className={styles.center}>
                <h1>Maintain dish</h1>
                {show ? <p>Something went wrong or no values were entered</p> : null}
                {confirm ?  //Warning for deleting dish
                    <div>
                        <div className={styles.popupdish} >
                            <div className={styles.popupdishtext} style={{ textAlign: "center" }}>
                                <p>Are you sure you want to delete this dish?</p>
                                <button onClick={yesDel}>Yes</button>
                                <button onClick={noDel}>No</button>
                            </div>
                        </div>
                    </div>
                    : null}
                {dish ?
                    <form className={styles.mtndishform} onSubmit={update}>
                        <table className={styles.dishtable}>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="name">Name</label></td>
                                    <td><input type="text" name="name" id="name" placeholder={dish.name} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="cat">Category</label></td>
                                    <td><input type="text" list="cats" id="cat" name="cat" placeholder={dish.category} />
                                        <datalist id="cats">
                                            <option value="Entree"></option>
                                            <option value="Main"></option>
                                            <option value="Desert"></option>
                                            <option value="Side"></option>
                                        </datalist>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="desc">Description</label></td>
                                    <td><textarea name="desc" cols="22" rows="5" placeholder={dish.desc} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="price">Price</label></td>
                                    <td><input type="number" id="price" name="price" min="0" placeholder={dish.price} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="photo">Picture</label></td>
                                    <td><input type="file" name="photo" id="photo" onChange={onChange} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <input type="submit" value="Update" />
                        <button onClick={del}>Delete</button>
                        <button onClick={cancel}>Cancel</button>
                    </form>
                    : <p>Dish not found</p>}
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`http://localhost:5000/dishes`)
    const dishes = await res.json()
    return {
        props: { dishes },
    }
}

export default mtndish
