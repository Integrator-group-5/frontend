import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import AuthContext from "../context/AuthContext";
import styles from "../styles/User.module.css";
import axiosInstance from "../Utils/axiosInstance";

const User = () => {

    const [showMenu, setShowMenu] = useState(false);
    const [userInfo, setUserInfo] = useState({ first_name: 'User', last_name: 'User' });
    const { logoutUser } = useContext(AuthContext);
    const axios = axiosInstance();
    const navigate = useNavigate(); // Inicializa useNavigate

    const getUserInfo = async () => {
        const response = await axios.get('/api/v1/users/user-info');
        const userInfo = response.data;
        setUserInfo(userInfo);
    }

    const handleShowMenu = () => {
        setShowMenu(!showMenu);
    }

    const goToFavorites = () => {
        navigate('/favList'); // Redirige a la ruta de favoritos
        setShowMenu(false); // Oculta el menú
    };

    const goToReservations = () => {
        navigate('/reservations'); // Redirige a la ruta de favoritos
        setShowMenu(false); // Oculta el menú
    };

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.greeting}>
                <span>¡Hola,</span>
                <span>{userInfo?.first_name[0].toUpperCase() + userInfo.first_name.slice(1)}!</span>
            </div>
            <div className={styles.avatar}>
                {userInfo?.first_name[0].toUpperCase()}
                {userInfo?.last_name[0].toUpperCase()}
            </div>
            <img src="/downArrow.svg" onClick={handleShowMenu} />
            {showMenu &&
                <div className={styles.dropdownContainer} onClick={handleShowMenu}>
                    <div className={styles.dropdown}>
                        <img src="/arrowMenu.svg" className={styles.arrowMenu} />
                        <span className={styles.option} onClick={goToReservations}><img src="/misPedidos.png" />Mis pedidos</span>
                        <span className={styles.option}><img src="/usuario.png" />Mi cuenta</span>
                        <span className={styles.option} onClick={goToFavorites}><i className="fas fa-heart" style={{ color: "#9C62B1", fontSize: "24px" }} ></i>Mis favoritos</span>
                        <button className={styles.button} onClick={logoutUser}>Cerrar sesión</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default User;