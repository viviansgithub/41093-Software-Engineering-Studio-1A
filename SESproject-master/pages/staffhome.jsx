import Image from 'next/image'
import { useEffect, useState } from 'react'
import Navi from '../components/Staffnav'
import styles from '../styles/staffhome.module.css'
const Staffhome = () => {

    return (
        <div className={styles.Staffhome}>
            <Navi></Navi>
            <h1 className={styles.le}>Welcome</h1>
            <div className={styles.imgcent}>
            <img className={styles.kit} src='/kitchen.jpg'></img>
            </div>
            <div className={styles.center}>
                <p>Le Bistrot d'Andre is a exquisite French restaurant and we take much pride in our food that we serve to our precious customers.
                    You will find the staff operations in the navigation bar at the top of the screen.
                </p>
            </div>
        </div>
    )
}

export default Staffhome