import React, { useState } from "react";
import styles from "../styles/wappButton.module.css"

const WappButton = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = () => {
    const whatsappUrl = "https://wa.me/525514328661"; // Reemplazar número
    try {
      window.open(whatsappUrl, "_blank");
      setSuccess(true); // Mostrar notificación de éxito
    } catch (e) {
      setError(true); // Mostrar mensaje de error si algo falla
    }
  };

  const handleCloseNotification = () => {
    setSuccess(false); // Ocultar notificación de éxito
    setError(false);   // Ocultar notificación de error
  };

  return (
    <div>
      <div className={styles.whatsappFloating} onClick={handleClick}>
        <img
          src="/WA.png"
          alt="WhatsApp"
        />
      </div>

      {/* Notificación de éxito */}
      {success && (
        <div className={styles.successNotification}>
          Te hemos dirigido correctamente al chat de WhatsApp.
          <button onClick={handleCloseNotification} className={styles.closeButton}>
            Aceptar
          </button>
        </div>
      )}

      {/* Notificación de error */}
      {error && (
        <div className={styles.errorNotification}>
          Hubo un error al intentar abrir WhatsApp. Verifica tu conexión.
          <button onClick={handleCloseNotification} className={styles.closeButton}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default WappButton;

