import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import stylesHeart from "../styles/heart.module.css";
import useAxios from "../Utils/axiosInstance";
import { useContextGlobal } from "../context/globalContext";
import { faL } from "@fortawesome/free-solid-svg-icons";

const HeartButton = ({id,onToggle }) => {
  const [liked, setLiked] = useState(false);
  const {user}=useContext(AuthContext);
  const{dispatch}= useContextGlobal();
  const axios = useAxios() 
  // Cargar el estado inicial del botón al montar el componente
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `/api/v1/users/favorites`
          );
          // Verifica si el producto está en la lista de favoritos
          const isFavorite = response.data.content.some(
            (favorite) => favorite.productId === id
          );
          setLiked(isFavorite); // Actualiza el estado local
        } catch (error) {
          console.error("Error al cargar el estado de favoritos:", error);
        }
      }else{
        setLiked(false) // Si no hay usuario, resetea a no favorito
      }
    };

    fetchFavoriteStatus();
  }, [user, id, axios]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!user) {     
      dispatch({
        type: "SHOW_MODAL_GLOBAL",
        payload: {
          img: "./ohNo.png",
          titulo: "Error",
          subtitulo: "Hubo un problema.",
          mensaje: "Por favor, inicia sesión para añadir este producto a tu lista de favoritos.",
        },
      });
      return;
    }
    // Alternar estado de "Like" solo después de una solicitud exitosa
    try {

      // Realiza el POST a la API con el ID de la tarjeta
      const response = await axios.post(
        `/api/v1/users/toggle-favorites?page=0&size=6&productId=${id}`,null,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data); // Opcional: manejar la respuesta
      setLiked(!liked); // Cambia el estado de "Like"
      if (onToggle) onToggle();
    } catch (error) {
      console.error("Error al hacer toggle de favoritos:", error);
    }
  };

  return (
    <>
        <button
        onClick={toggleLike}
        className={stylesHeart.heart}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {liked ? (
          <i
            className="fas fa-heart"
            style={{ color: "red", fontSize: "22px" }}
          ></i>
        ) : (
          <i
            className="far fa-heart"
            style={{ color: "black", fontSize: "22px" }}
          ></i>
        )}
      </button>
    </>
  );
};

export default HeartButton;
