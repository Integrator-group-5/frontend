import styles from "../styles/NewHeader.module.css";
import { useState } from "react";

const NewHeader = () => {

    const [isOpen, setIsOpen] = useState(false);

    const handleHamburger = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div className={styles.container}>
        {isOpen && <div className={styles.menu}>
            <div className={styles.menuHeader}>
                <img className={styles.logo} src="logo.png"/>
                <img src="cerrar.png" onClick={handleHamburger}/>
            </div>
        </div>}
        <img className={styles.logo} src="logo.png"/>
        <div className={styles.links}>
            <span>Nosotros</span>
            <span>Sostenibilidad</span>
            <span>Contacto</span>
        </div>
        <div className={styles.buttons}>
            <button className={styles.button}>Iniciar Sesión</button>
            <button className={styles.button}>Crear Cuenta</button>
        </div>
        <img className={styles.hamburger} src="menu.png" onClick={handleHamburger}/>
    </div>
  )
}

export default NewHeader;