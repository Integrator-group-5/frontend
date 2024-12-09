import React from "react";
import styles from "../styles/PaginatedProductList.module.css";
import HeartButton from "./HeartButton";
import { formatCurrency } from "../Utils/currencyFormatter";
import { useNavigate } from "react-router-dom";

const CardProduct = ({ products,onToggle }) => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleCardClick = (productId) => {
    navigate(`/detail/${productId}`); // Navigate to the detail page with productId
  };
  return (
    <div className={styles.products}>
      {products.map((product) => (
        <div
          key={product.productId}
          className={styles.productCard}
          onClick={() => handleCardClick(product.productId)}
        >
          <HeartButton id={product.productId} onToggle={onToggle} />
          <img
            className={styles.productImage}
            src={`${baseUrl}${product.images[0].url}`}
            alt={product.name}
            onError={(e) => {
              const fallback1 = `${baseUrl}/${product.images[0].url}`; // First fallback image
              const fallback2 = `${baseUrl}/public${product.images[0].url}`; // Second fallback image
              const fallback3 = "placeholder.svg"; // Second fallback image

              if (e.target.src === `${baseUrl}${product.images[0].url}`) {
                e.target.src = fallback1; // Switch to the first fallback
              } else if (e.target.src === fallback1) {
                e.target.src = fallback2; // Switch to the second fallback
              } else if (e.target.src === fallback2) {
                e.target.src = fallback3; // Switch to the third fallback
              } else {
                e.target.onerror = null; // Prevent infinite fallback loop
              }
            }}
          />
          <div className={styles.contenedor}>
            <h2>{product.name}</h2>
            <p>Alquiler: {formatCurrency(product.price, "es-CO", "COP")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProduct;
