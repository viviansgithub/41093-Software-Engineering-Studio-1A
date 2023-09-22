import React from 'react'
import { useEffect, useState } from 'react'
import Navi from '../components/Custnav'
import Image from 'next/image'
import styles from '../styles/menu.module.css'

const menu = ({dishes}) => {
    const[catDishes, setCatDishes ] = useState()
    const [mainDishes, setmainDishes] = useState()
    const[entreeDishes, setentreeDishes] = useState()
    const[sideDishes, setsideDishes] = useState()
    const[dessertDishes, setdessertDishes] = useState()
    

    useEffect(() =>{
        setmainDishes([])
        setentreeDishes([])
        setsideDishes([])
        setdessertDishes([])
        for(let i=0; i<dishes.length; i++)
        {
            if(dishes[i].category == "Main")
                setmainDishes(mainDishes => [...mainDishes,dishes[i]])
            else if(dishes[i].category == "Entree")
                setentreeDishes(entreeDishes => [...entreeDishes,dishes[i]])
            else if(dishes[i].category == "Side")
                setsideDishes(sideDishes => [...sideDishes,dishes[i]])
            else if(dishes[i].category == "Dessert")
                setdessertDishes(dessertDishes => [...dessertDishes,dishes[i]])

        }
    })
    // function onCatChange() {
    //     setCatDishes([])
    //     const cat = document.getElementById("category").value
    //     if (cat != "All") {
    //         for (let i = 0; i < dishes.length; i++) {
    //             if (dishes[i].category == cat) {
    //                 setCatDishes(catDishes => [...catDishes, dishes[i]])
    //             }
    //         }
    //     }
    //     else {
    //         for (let i = 0; i < dishes.length; i++) {
    //             setCatDishes(catDishes => [...catDishes, dishes[i]])
    //         }
    //     }
    // }

    function getImage(dish) {
        return `/uploads/${dish.photoName}`
    }
    return (
        <div className={styles.menupage}>
            <Navi></Navi>
            <h1 className={styles.title}>Our Menu</h1>
            {/* <div className={styles.menuopt}>
            <h3>Sort by category:</h3>
                <select name="category" id="category" onChange={onCatChange}>
                    <option value="All">All</option>
                    <option value="Entree">Entree</option>
                    <option value="Main">Main</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Side">Side</option>
                </select>
            </div> */}
            <h2>Entree</h2>
            <div className={styles.break}/>
            {entreeDishes ? 
                <div className={styles.menu}>
                    {entreeDishes.map((dish) =>(
                        <div key={dish.id} className={styles.singlemenu}>
                            <div className={styles.imgcent}><img src={getImage(dish)}/></div>
                            <div className={styles.menucontent}>
                                <h3>{dish.name}<span>${dish.price}</span></h3>
                                {/* <h5>{dish.category}</h5> */}
                                <p>{dish.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            :  null
            }
            <h2>Main</h2>
            <div className={styles.break}/>
            {mainDishes ? 
                <div className={styles.menu}>
                    {mainDishes.map((dish) =>(
                        <div key={dish.id} className={styles.singlemenu}>
                            <div className={styles.imgcent}><img src={getImage(dish)}/></div>
                            <div className={styles.menucontent}>
                                <h3>{dish.name}<span>${dish.price}</span></h3>
                                {/* <h5>{dish.category}</h5> */}
                                <p>{dish.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            :  null
            }
            <h2>Desserts</h2>
            <div className={styles.break}/>
            {dessertDishes ? 
                <div className={styles.menu}>
                    {dessertDishes.map((dish) =>(
                        <div key={dish.id} className={styles.singlemenu}>
                            <div className={styles.imgcent}><img src={getImage(dish)}/></div>
                            <div className={styles.menucontent}>
                                <h3>{dish.name}<span>${dish.price}</span></h3>
                                {/* <h5>{dish.category}</h5> */}
                                <p>{dish.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            :  null
            }
            <h2>Side</h2>
            <div className={styles.break}/>
            {sideDishes ? 
                <div className={styles.menu}>
                    {sideDishes.map((dish) =>(
                        <div key={dish.id} className={styles.singlemenu}>
                            <div className={styles.imgcent}><img src={getImage(dish)}/></div>
                            <div className={styles.menucontent}>
                                <h3>{dish.name}<span>${dish.price}</span></h3>
                                {/* <h5>{dish.category}</h5> */}
                                <p>{dish.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            :  null
            }
        </div>
    )
}

export async function getServerSideProps(){
    const res = await fetch(`http://localhost:5000/dishes`)
    const dishes = await res.json()
    return {
        props:{ dishes },
    }
  }
  
export default menu
