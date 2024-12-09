import { formatCurrency } from "../Utils/currencyFormatter";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Detail.module.css";
import styleReservation from "../styles/DetailReservation.module.css";
import backButton from "../Images/backArrow.png";
import ModalGlobal from "../components/ModalGlobal";
import useAxios from "../Utils/axiosInstance";

function DetailReservation() {
  const location = useLocation();
  const { productId } = location.state || undefined;
  const baseUrl= import.meta.env.VITE_API_BASE_URL
  const axios = useAxios();
  const [product, setProduct] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetail = async () => {
      try {
        const responseReservation = await axios.get(
          baseUrl + `/api/v1/reservations/${productId}`
        );
        const dataReservation = await responseReservation.data;
        setReservation(dataReservation);

        const responseImages = await fetch(
          baseUrl + `/api/v1/products/by-name/${dataReservation.productName}`
        );
        const data = await responseImages.json();
        setProduct(data);
        setMainImage(data.images[0]?.url ?? "placeholder.svg");
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [productId, axios]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div className={styleReservation.detailContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{product.name}</h1>
        <Link to="/reservations" className={styles.backButton}>
          {" "}
          <img src={backButton} alt="Back" />
        </Link>
      </header>

      <div className={styleReservation.content}>
        {/* Imagen principal */}
        <img
          src={baseUrl + mainImage}
          alt={product.name}
          className={styles.productImage}
          onError={(e) => {
            const fallback1 = `${baseUrl}/${mainImage}`;
            const fallback2 = `${baseUrl}/public${mainImage}`;
            const fallback3 = "placeholder.svg";
            if (e.target.src === `${baseUrl}${mainImage}`) {
              e.target.src = fallback1;
            } else if (e.target.src === fallback1) {
              e.target.src = fallback2;
            } else if (e.target.src === fallback2) {
              e.target.src = fallback3;
            } else {
              e.target.onerror = null;
            }
          }}
        />
        <div className={styles.gallery}>
          {/* Galería de miniaturas */}
          {product.images.map((img, index) => (
            <img
              key={index}
              src={baseUrl + img.url}
              alt={`${product.name} thumbnail ${index + 1}`}
              className={styles.thumbnail}
              onClick={() => setMainImage(img.url)}
              onError={(e) => {
                const fallback1 = `${baseUrl}/${img.url}`;
                const fallback2 = `${baseUrl}/public${img.url}`;
                const fallback3 = "placeholder.svg";
                if (e.target.src === `${baseUrl}${img.url}`) {
                  e.target.src = fallback1;
                } else if (e.target.src === fallback1) {
                  e.target.src = fallback2;
                } else if (e.target.src === fallback2) {
                  e.target.src = fallback3;
                } else {
                  e.target.onerror = null;
                }
              }}
            />
          ))}
        </div>

        <div className={styleReservation.titleReservation}>
          Detalles de la reserva:
        </div>

        <div className={styleReservation.container}>
          <div className={styleReservation.titleHidden}>
            Detalles de tu reserva:
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Código de Reserva:</span>
            <span className={styleReservation.value}>
              {reservation.reservationCode}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Nombre del producto</span>
            <span className={styleReservation.value}>
              {reservation.productName}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Fecha de entrega:</span>
            <span className={styleReservation.value}>
              {reservation.startDate}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Fecha de devolución:</span>
            <span className={styleReservation.value}>
              {reservation.endDate}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Metodo de Envío:</span>
            <span className={styleReservation.value}>
              {reservation.shippingMethod}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>País:</span>
            <span className={styleReservation.value}>
              {reservation.country}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Provincia:</span>
            <span className={styleReservation.value}>
              {reservation.province}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Dirección:</span>
            <span className={styleReservation.value}>
              {reservation.address}
            </span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Detalle:</span>
            <span className={styleReservation.value}>{reservation.detail}</span>
          </div>
          <div className={styleReservation.row}>
            <span className={styleReservation.label}>Costo Total:</span>
            <span className={styleReservation.value}>
              {formatCurrency(reservation.totalCost, "es-CO", "COP")}
            </span>
          </div>
        </div>
      </div>
      <ModalGlobal />
    </div>
  );
}
export default DetailReservation;
