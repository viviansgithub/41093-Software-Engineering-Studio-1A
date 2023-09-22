import router from 'next/router'
import { useEffect, useState } from 'react'
import Navi from '../components/Staffnav'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import styles from '../styles/mtnmenu.module.css'


const mtnmenu = ({ dishes }) => {

    const [addShow, setAddShow] = useState(false)
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('Choose File')
    const [catDishes, setCatDishes] = useState()
    const [catWarn, setCatWarn] = useState(false)

    let entree = []
    let main = []
    let dessert = []
    let side = []

    for (const dish of dishes) {
        switch (dish.category) {
            case "Entree":
                entree.push(dish);
                break;
            case "Main":
                main.push(dish);
                break;
            case "Dessert":
                dessert.push(dish);
                break;
            case "Side":
                side.push(dish)
                break;
        }
    }

    function onCatChange() {
        setCatDishes([])
        const cat = document.getElementById("category").value
        switch (cat) {
            case "Entree":
                setCatDishes(entree);
                break;
            case "Main":
                setCatDishes(main);
                break;
            case "Dessert":
                setCatDishes(dessert);
                break;
            case "Side":
                setCatDishes(side);
                break;
            default:
                setCatDishes(dishes);
                break;
        }
    }

    function onAddChange() {
        const cat = document.getElementById("cat").value
        let temp = []
        let count = 0
        let total = 0
        switch (cat) {
            case "Entree":
                temp = entree
                break;
            case "Main":
                temp = main
                break;
            case "Dessert":
                temp = dessert
                break;
            case "Side":
                temp = dessert
                break;
        }
        for (const dish of temp) {
            total = total + parseInt(dish.price)
            count++
        }
        document.getElementById("price").value = Math.round(total / count)
    }

    function manage(id) {
        sessionStorage.setItem("dishID", id)
        router.push('/mtndish')
    }

    function add() {
        setAddShow(true)
    }

    function cancel(event) {
        event.preventDefault()
        setAddShow(false)
        setCatWarn(false)
    }

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

    async function addConf(event) {

        event.preventDefault();

        const name = event.target.name.value
        const cat = event.target.cat.value
        const desc = event.target.desc.value
        const price = event.target.price.value

        console.log(cat)
        if (cat == "Select") {
            setCatWarn(true)
            return
        }
        event.preventDefault()
        uploadFile()
        const res = await fetch(
            `http://localhost:5000/dishes`,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    category: cat,
                    desc: desc,
                    price: price,
                    photoName: filename
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        if (res.status == 201) {
            setAddShow(false)
            router.reload();
        }

    }

    function getImage(dish) {
        return `/uploads/${dish.photoName}`
    }

    return (
        <div className={styles.mtnmenu}>
            <Navi></Navi>
            <div className={styles.center}>
                <h1>Maintain Menu</h1>
                <button className={styles.mtnmenub} onClick={add}>Add Dish</button>
                <br />
                <div className={styles.mtnmenuopt}>
                    <p>Sort by category</p>
                    <select name="category" id="category" onChange={onCatChange}>
                        <option value="All">All</option>
                        <option value="Entree">Entree</option>
                        <option value="Main">Main</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Side">Side</option>
                    </select>
                </div>
                {addShow ?  //Warning for deleting user
                    <div>
                        <div className={styles.adddish}>
                            <h1>Add Dish</h1>
                            <form onSubmit={addConf}>
                                <table className={styles.adddishtable}>
                                    <tbody>
                                        <tr>
                                            <td><label htmlFor="name">Name</label></td>
                                            <td><input type="text" name="name" id="name" required /></td>
                                        </tr>
                                        {catWarn ? <tr><td></td><td><p style={{ margin: "0" }}>Must select a category</p></td></tr> : null}
                                        <tr>
                                            <td><label htmlFor="cat">Category</label></td>
                                            <td><select name="cat" id="cat" onChange={onAddChange} required>
                                                <option value="Select">Select</option>
                                                <option value="Entree">Entree</option>
                                                <option value="Main">Main</option>
                                                <option value="Dessert">Dessert</option>
                                                <option value="Side">Side</option>
                                            </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="desc">Description</label></td>
                                            <td><textarea name="desc" cols="22" rows="5" required /></td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="price">Price</label></td>
                                            <td><input type="number" id="price" name="price" min="0" step="1" required /></td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="photo">Picture</label></td>
                                            <td><input type="file" name="photo" id="photo" onChange={onChange} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={styles.adddishsubmit}>
                                    <input type="submit" value="Add Dish" />
                                    <button onClick={cancel}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    : null}
                {catDishes ?
                    <table className={styles.mtnmenutable}>
                        <thead>
                            <tr><td>Photo</td><td>Name</td><td>Category</td><td width="200">Description</td><td>Price</td><td></td></tr>
                        </thead>
                        <tbody>
                            {catDishes.map((dish) => (
                                <tr key={dish.id}><td><Image src={getImage(dish)} width="150" height="auto" /></td>
                                    <td>{dish.name}</td>
                                    <td>{dish.category}</td><td>{dish.desc}</td>
                                    <td>${dish.price}</td>
                                    <td><button onClick={() => manage(dish.id)}>Manage</button></td></tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    <table className={styles.mtnmenutable}>
                        <thead>
                            <tr><td>Photo</td><td>Name</td><td>Category</td><td width="200">Description</td><td>Price</td><td></td></tr>
                        </thead>
                        <tbody>
                            {dishes.map((dish) => (
                                <tr key={dish.id}><td><Image src={getImage(dish)} width="150" height="auto" /></td>
                                    <td>{dish.name}</td>
                                    <td>{dish.category}</td><td>{dish.desc}</td>
                                    <td>${dish.price}</td>
                                    <td><button onClick={() => manage(dish.id)}>Manage</button></td></tr>
                            ))}
                        </tbody>
                    </table>
                }
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

export default mtnmenu
