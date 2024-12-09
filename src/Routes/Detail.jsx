import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Detail.module.css";
import backButton from "../Images/backArrow.png";
import { formatCurrency } from "../Utils/currencyFormatter";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContextGlobal } from "../context/globalContext";
import ModalGlobal from "../components/ModalGlobal";

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(""); // Estado para la imagen principal
  const [caracteristicas, setCaracteristicas] = useState(false);
  const [disabled,setDisabled]=useState(true)
  
  const [startDate, setStartDate] = useState({ day: null, month: null, year: null });
  const [endDate, setEndDate] = useState({ day: null, month: null, year: null });
  const [isOpen, setIsOpen] = useState(false);
  const [closedDates, setClosedDates] = useState([]);
  
  const [politicas, setPoliticas] = useState(false); // Nuevo estado para políticas
  const [startDateToggle, setStartDateToggle] = useState(false);
  const {dispatch}=useContextGlobal();
  const {user}=useContext(AuthContext);

  const navigate = useNavigate();
  const baseUrl=import.meta.env.VITE_API_BASE_URL;

  document.addEventListener('scroll', () => { if (window.screen.width > 500) { setIsOpen(false); setStartDateToggle(false); } });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Llamada a la API para obtener el detalle del producto
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/products/${id}`
        );
        const data = await response.json();
        console.log(data);
        setProduct(data);
        setMainImage(data.images[0]?.url ?? "placeholder.svg"); // Establece la primera imagen como principal
        const response2 = await fetch(
          `${baseUrl}/api/v1/products/${id}/availability`
        );
        const data2 = await response2.json();
        setClosedDates(data2.unavailableDates.map((date) => {
          let arr = date.split('-');
          return { day: parseInt(arr[2]), month: parseInt(arr[1]) - 1, year: parseInt(arr[0]) }
        }));
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [id]);
  useEffect(()=>{
    if(startDate.day && endDate.day){
      setDisabled(false)
    }
  },[startDate,endDate])
  const toggleCaracteristicas = () => {
    setCaracteristicas(!caracteristicas);
  };

  const togglePoliticas = () => {
    setPoliticas(!politicas);
  };
  if (!product) return <p>Cargando...</p>;

  const handleGoBack=()=>{
    navigate(-1); //va a la pagina directamente anterior
  }

  //verificar si esta logueado para hacer la reserva 
  const handleReservation=()=>{
    if(!user){
      dispatch({
        type: "SHOW_MODAL_GLOBAL",
        payload: {
          img: "/ohNo.png",
          titulo: "Error",
          subtitulo: "Hubo un problema.",
          mensaje: "Por favor, inicia sesión para poder realizar tu reserva",
          onClose: ()=>navigate("/login"),
        },
      });
      return;
    }
    else if(user && startDate.day && endDate.day ){
      navigate("/checkout", {
        state: {
          id,
          startDate,
          endDate,
        },
      });
    }
  }

  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{product.name}</h1>
        <span className={styles.back} onClick={handleGoBack}>
          <img src={backButton} alt="Ir atras" />
        </span>
      </header>

      <div className={styles.content}>
        {/* Imagen principal */}
        <img
          src={`${baseUrl}${mainImage}`}
          alt={product.name}
          className={styles.productImage}
          onError={(e) => {
            const fallback1 = `${baseUrl}/${mainImage}`; // First fallback image
            const fallback2 = `${baseUrl}/public${mainImage}`; // Second fallback image
            const fallback3 = "placeholder.svg"; // Third fallback image
            if (e.target.src === `${baseUrl}${mainImage}`) {
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
        <div className={styles.gallery}>
          {/* Galería de miniaturas */}
          {product.images.map((img, index) => (
            <img
              key={index}
              src={`${baseUrl}${img.url}`}
              alt={`${product.name} thumbnail ${index + 1}`}
              className={styles.thumbnail}
              onClick={() => setMainImage(img.url)} // Cambia la imagen principal
              onError={(e) => {
                const fallback1 = `${baseUrl}/${img.url}`; // First fallback image
                const fallback2 = `${baseUrl}/public${img.url}`; // Second fallback image
                const fallback3 = "placeholder.svg"; // Third fallback image
                if (e.target.src === `${baseUrl}${img.url}`) {
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
          ))}
        </div>
        <div className={styles.productInfo}>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>
            Alquiler:{" "}
            <span>{formatCurrency(product.price, "es-CO", "COP")}</span>
          </p>
          <div className={styles.dateSelector}>
            <div className={startDateToggle ? styles.dateOuterContainerToggled : styles.dateOuterContainer}
                 onClick={() => {
                   setIsOpen(true);
                   setStartDateToggle(!startDateToggle);
                 }}>
              <div className={styles.dateContainer}>
                <span>Alquila</span>
                <span
                  className={styles.date}>{startDate.day == null ? 'Desde' : startDate.day + '/' + (startDate.month + 1) + '/' + startDate.year}</span>
              </div>
              <span onClick={() => {
                setStartDate({day: null, month: null, year: null});
                setEndDate({day: null, month: null, year: null});
              }}>{startDate.day != null ? 'x' : ''}</span>
            </div>
            <span className={styles.separator}>|</span>
            <div className={styles.dateOuterContainer} onClick={() => setIsOpen(true)}>
              <div className={styles.dateContainer}>
                <span>Devuelve</span>
                <span
                  className={styles.date}>{endDate.day == null ? 'Hasta' : endDate.day + '/' + (endDate.month + 1) + '/' + endDate.year}</span>
              </div>
              <span
                onClick={() => setEndDate({day: null, month: null, year: null})}>{endDate.day != null ? 'x' : ''}</span>
            </div>
            <div>
              <button className={`${styles.botonReserva} ${disabled ? styles.disabled : ""}`} onClick={handleReservation} >Reservar</button>
            </div>
          </div>
          {isOpen && <div className={styles.calendarContainer} onClick={() => setIsOpen(false)}>
            <div className={styles.calendar} onClick={(e) => e.stopPropagation()}>
              <Calendar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                startDate={startDate}
                endDate={endDate}
                closedDates={closedDates}
                startDateToggle={startDateToggle}
                setStartDateToggle={setStartDateToggle}
                setIsOpen={setIsOpen} />
            </div>
          </div>}

          <div className={styles.caract}>
            <div className={styles.encabezado} onClick={toggleCaracteristicas}>
              <p className={styles.titleHeader}>Caracteristicas</p>
              <span
                className={`${styles.arrow} ${caracteristicas ? "" : styles.open
                  }`}
              >
                <img src="/Right.svg" alt="" />
              </span>
            </div>

            {/* tabla caracteristicas  */}
            <div
              className={`${styles.tabla} ${caracteristicas ? styles.visible : ""
                }`}
            >
                <tbody className={styles.table}>
                  <tr>
                    <td style={{ background: "#F9F9F9" }}>
                      <img src="/brand.png" alt=""/>
                      Referencia
                    </td>
                    <td style={{ background: "#F9F9F9" }}>
                      {product.reference}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/dress.png" alt="" />
                      Modelo
                    </td>
                    <td>{product.name}</td>
                  </tr>
                  <tr>
                    <td style={{ background: "#F9F9F9" }}>
                      <img src="/tijeras.png" alt="" />
                      Diseñador
                    </td>
                    <td style={{ background: "#F9F9F9" }}>
                      {product.designer}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/material.png" alt="" />
                      Material
                    </td>
                    <td>{product.material}</td>
                  </tr>
                  <tr>
                    <td style={{ background: "#F9F9F9" }}>
                      <img src="/tipo.png" alt="" />
                      Tipo
                    </td>
                    <td style={{ background: "#F9F9F9" }}>
                      {product.category.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/talla.png" alt="" />
                      Tallas disponibles
                    </td>
                    <td>
                      {product.sizes.map((size, index) => (
                        <span key={index}>
                          {size.size}
                          {index < product.sizes.length - 1 ? ", " : ""}
                          {/* Agrega coma entre tallas */}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
            </div>
          </div>
          {/* Políticas del producto */}
          <div className={styles.caract}>
            <div className={styles.encabezado} onClick={togglePoliticas}>
              <p className={styles.politicasTitle}>Políticas del producto</p>
              <span
                className={`${styles.arrow} ${politicas ? "" : styles.open
                  }`}
              >
                <img src="/Right.svg" alt="" />
              </span>
            </div>

              <div
                className={`${styles.tabla} ${politicas ? styles.visible : ""
                }`}
              >
                <div className={styles.politicasContent}>
                  <div className={styles.politicasContainer}>
                    <div className={styles.politica}>
                      <strong>Depósito:</strong>
                      <li>El cliente debe pagar un depósito para apartar el vestido y garantizar su devolución en buen
                        estado.
                      </li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Entrega:</strong>
                      <li>El cliente debe entregar el vestido en la fecha y lugar acordados. Si se retrasa, se le puede
                        descontar del depósito.
                      </li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Condiciones del vestido:</strong>
                      <li>El cliente debe entregar el vestido en las mismas condiciones en que lo recibió, sin
                        modificaciones, desperfectos o lavados.
                      </li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Notificación de daños:</strong>
                      <li>El cliente debe notificar cualquier daño o pérdida del vestido de manera oportuna.</li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Arreglos:</strong>
                      <li>El cliente no puede realizar arreglos, ajustes o modificaciones en el vestido. Si lo hace, la
                        empresa puede cobrarle el costo de reposición.
                      </li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Limpieza:</strong>
                      <li>La empresa se encarga de la limpieza del vestido, por lo que el cliente no debe lavarlo.</li>
                    </div>
                    <div className={styles.politica}>
                      <strong>Recomendaciones de tiempo: </strong>
                      <li>Se recomienda realizar el alquiler con al menos una semana de anticipación.</li>
                    </div>
                    {/* Puedes agregar más políticas aquí */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalGlobal/>
    </div>
  );
};

export default Detail;