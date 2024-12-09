import { useEffect, useState } from "react";
import RentaStyle from "../styles/topRentas.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "./Card";

const TopRentas = () => {
  const [topRentas, setTopRentas] = useState([]);
  const navigate=useNavigate();
  const baseUrl= import.meta.env.VITE_API_BASE_URL
  const url =`${baseUrl}/api/v1/products/top-rents`;

  useEffect(() => {
    const fetchData = async () => {
      let respuesta = await fetch(url);
      let data = await respuesta.json();
      setTopRentas(data);
      console.log("product", data);
    };
    fetchData();
  }, []);
  const puntuacion = [4.8, 4.9, 4.5, 4.7, 4.5, 4.8];
  const handleCardClick = (productId) => {
    navigate(`/detail/${productId}`); // Navigate to the detail page with productId
  };

  return (
    <div className={RentaStyle.contenedor}>
      <h2 className={RentaStyle.titulo}>Lo más recomendado</h2>
      <div className={RentaStyle.listaProductos}>
        {/*recorre lista aleatorizada */}
          {topRentas.map((data, index) => (
            <div onClick={()=>handleCardClick(data.productId)} key={data.productId} className={RentaStyle.producto}>
              <Card
                image={data.images[0].url}
                name={data.name}
              />
              <div className={RentaStyle.contenedorEstrellas}>
                <div>
                  <i className={`fas fa-star ${RentaStyle.relleno}`}></i>
                  <i className={`fas fa-star ${RentaStyle.relleno}`}></i>
                  <i className={`fas fa-star ${RentaStyle.relleno}`}></i>
                  <i className={`fas fa-star ${RentaStyle.relleno}`}></i>
                  <i className={`far fa-star ${RentaStyle.sinRelleno}`}></i>
                </div>
                <div className={RentaStyle.puntuacion}>{puntuacion[index]}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopRentas;
