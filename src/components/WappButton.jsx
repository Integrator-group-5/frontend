import React, { useState } from "react";
import styles from "../styles/wappButton.module.css";

const WappButton = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleClick = () => {
    const whatsappUrl = "https://wa.me/525514328661"; // Reemplazar número
    try {
      window.open(whatsappUrl, "_blank");
      setSuccess(true); // Mostrar notificación de éxito

      // Simulación de mensaje enviado correctamente después de 25 segundos
      setTimeout(() => {
        setMessageSent(true);
      }, 25000);
    } catch (e) {
      setError(true); // Mostrar mensaje de error si algo falla
    }
  };

  const handleCloseNotification = () => {
    setSuccess(false); // Ocultar notificación de éxito
    setError(false);   // Ocultar notificación de error
    setMessageSent(false); // Ocultar notificación de mensaje enviado
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

      {/* Notificación de confirmación de mensaje enviado */}
      {messageSent && (
        <div className={styles.successNotification}>
          Tu mensaje ha sido recibido correctamente, pronto nuestro equipo se pondrá en contacto contigo.
          <button onClick={handleCloseNotification} className={styles.closeButton}>
            Cerrar
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
