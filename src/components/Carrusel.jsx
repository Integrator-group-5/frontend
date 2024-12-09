import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StyleCarrusel from "../styles/carrusel.module.css";

const Carrusel = () => {
  const [categorias, setCategorias] = useState([]);
  const [numBotones, setNumBotones] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carruselRef = useRef();
  const intervalRef = useRef();
  const baseUrl=import.meta.env.VITE_API_BASE_URL

  const url = `${baseUrl}/api/v1/categories`;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      // Ensure the correct path for the image
      const formattedData = data.map((category) => ({
        ...category,
        cover: {
          ...category.cover,
          url: `${baseUrl}${category.cover.url}`, // Adjust base URL if needed
        },
      }));
      setCategorias([...formattedData, ...formattedData]);
      setNumBotones(data)
    };
    fetchData();
  }, []);

  const updateCarrusel = (index) => {
    const itemWidth = carruselRef.current?.children[0]?.offsetWidth || 0;
    setCurrentIndex(index);

    if (carruselRef.current) {
      carruselRef.current.style.transition = isTransitioning ? "transform 0.5s ease" : "none";
      carruselRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
    }
  };

  // Configurar el movimiento automático del carrusel
  useEffect(() => {
    if (categorias.length > 0) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        updateCarrusel(currentIndex + 1);
      }, 3000);

      return () => clearInterval(intervalRef.current);
    }
  }, [currentIndex, categorias.length]);

  // Bucle infinito para reiniciar el carrusel al llegar al final
  useEffect(() => {
    if (currentIndex === categorias.length/2) {
      setTimeout(() => {
        setIsTransitioning(false);
        updateCarrusel(0); // Volvemos al inicio sin transición visible
      }, 500);
    }
  }, [currentIndex, categorias.length]);

  // Controla los cambios de tamaño de pantalla
  const handleResize = () => {
    updateCarrusel(currentIndex);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  const handleIndicatorClick = (index) => {
    clearInterval(intervalRef.current);
    updateCarrusel(index);
  };


  return (
    <div className={StyleCarrusel.containerCarrusel}>
      <div
        className={StyleCarrusel.categoriaCarrusel}
        ref={carruselRef}
        style={{
          display: "flex",
          transition: isTransitioning ? "transform 0.5s ease" : "none",
        }}
      >
        {categorias.map((categoria, idx) => (
          <div key={idx} className={StyleCarrusel.carruselItem}>
            <Link
              to={`/${encodeURIComponent(categoria.name)}`}
              state={{ categoryDescription: categoria.description }}
              style={{ textDecoration: 'none' }}
            >
              <img
                className={StyleCarrusel.imagen}
                src={categoria?.cover?.url || "placeholder.svg"}
                alt={categoria.name}
                onError={(e) => {
                  e.target.src = "placeholder.svg"; // Fallback image
                  e.target.onerror = null; // Prevent infinite fallback loop
                }}
              />
              <h3 className={StyleCarrusel.nombreCategoria}>{categoria.name}</h3>
            </Link>
          </div>
        ))}
      </div>
      <div className={StyleCarrusel.indicadores}>
        {window.innerWidth <= 700 ? 
        (numBotones.map((_, index) => (
            <button
              key={index}
              className={`${StyleCarrusel.boton} ${
                index === currentIndex % (categorias.length / 2)
                  ? StyleCarrusel.activo
                  : ""
              }`}
              onClick={() => handleIndicatorClick(index)}
            ></button>
            ))
        ):(numBotones.slice(0,-1).map((_, index) => (
          <button
            key={index}
            className={`${StyleCarrusel.boton} ${
              index === currentIndex % (categorias.length / 2)
                ? StyleCarrusel.activo
                : ""
            }`}
            onClick={() => handleIndicatorClick(index)}
          ></button>)
          ))}
      </div>
    </div>
  );
};

export default Carrusel;