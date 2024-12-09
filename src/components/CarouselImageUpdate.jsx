import styles from "../styles/CarouselUpdate.module.css";

const baseUrl=import.meta.env.VITE_API_BASE_URL;

const CarouselImageUpdate = ({ images, onDelete }) => {
  return (
    <ul className={styles.carousel}>
      {images.map((image, index) => (
        <li key={index} className={styles.carouselItem}>
          {console.log("image 1", `${baseUrl}${image.url}`)}
          <img
            src={image.url ? `${baseUrl}${image.url}` : "../../public/loading.gif"}
            alt={`Imagen ${image.imageId || index + 1}`}
            className={styles.image}
            onError={(e) => {
              const fallback1 = `${baseUrl}/${image.url}`; // First fallback image
              const fallback2 = `${baseUrl}/public${image.url}`; // Second fallback image
              const fallback3 = "placeholder.svg"; // Third fallback image

              if (
                e.target.src ===`${baseUrl}${image.url}`
              ) {
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
          <button
            type="button"
            className={styles.deleteButton}
            onClick={(e) => {e.stopPropagation(); onDelete(image.imageId)}}
            aria-label={`Eliminar imagen ${index + 1}`}
          >
            ✖
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CarouselImageUpdate;

