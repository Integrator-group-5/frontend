import styles from '../styles/Card.module.css'; 

const Card = ({ name, image }) => {
  const baseUrl=import.meta.env.VITE_API_BASE_URL;
    return (
        <div className={styles.card}>
            <img
              src={`${baseUrl}${image}`}
              alt={name}
              className={styles.cardImage}
              onError={(e) => {
                const fallback1 = `${baseUrl}/${image}`; // First fallback image
                const fallback2 = `${baseUrl}/public${image}`; // Second fallback image
                const fallback3 = "placeholder.svg"; // Third fallback image

                if (e.target.src === `${baseUrl}${image}`) {
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
        </div>
    );
};

export default Card;