import { useEffect, useRef, useState } from "react";
import styles from "../styles/Search.module.css";
import Calendar from "./Calendar";
import PaginatedSearchList from "./PaginatedSearchList";
import Swal from 'sweetalert2';
import useAxios from "../Utils/axiosInstance.js";

const Search = ({isSearch, setIsSearch}) => {

  const [startDate, setStartDate] = useState({day: null, month: null, year: null});
  const [endDate, setEndDate] = useState({day: null, month: null, year: null});
  const [searchTerm, setSearchTerm] = useState(''); //valor del campo input
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchToggle, setSearchToggle] = useState(false);
  const [startDateToggle, setStartDateToggle] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [searchTerms, setSearchTerms] = useState([]); // Store dynamic suggestions
  const inputRef = useRef(null);
  const suggestionsRef = useRef([]); // Array de referencias para las sugerencias
  const axios = useAxios();

  // Fetch suggestions from the backend on component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get("/api/v1/products/keywords");
        setSearchTerms(response.data); // Save fetched suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las sugerencias.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };
    fetchSuggestions();
  }, []);

  // Función para manejar los cambios en el campo de entrada
  const handleSearchTermChange = (e) => {
    const userInput = e.target.value.toLowerCase();
    setSearchTerm(userInput);
    setActiveSuggestionIndex(-1);

    // Filtrar sugerencias que coinciden con el texto ingresado
    if (userInput) {
      const filtered = searchTerms.filter(term => term.toLowerCase().includes(userInput));
      setFilteredSuggestions(filtered); //array de las sugerencias que coinciden con lo escrito en el input
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Función para manejar la selección de una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion); // Actualizar el valor del campo de entrada
    setFilteredSuggestions([]); // Ocultar sugerencias después de seleccionar una
  };
   //cerrar las sugerencias si hace click fuera del input
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredSuggestions.length > 0) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveSuggestionIndex(prev => 
              prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveSuggestionIndex(prev => 
              prev > 0 ? prev - 1 : -1
            );
            break;
          case 'Escape':
            setFilteredSuggestions([]);
            setActiveSuggestionIndex(-1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredSuggestions, activeSuggestionIndex]);

  useEffect(() => {
    // Scroll automático a la sugerencia activa
    if (activeSuggestionIndex >= 0 && suggestionsRef.current[activeSuggestionIndex]) {
      suggestionsRef.current[activeSuggestionIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSuggestionIndex]);


  document.addEventListener('scroll', () => {if(window.screen.width > 500) {setIsOpen(false); setStartDateToggle(false);}});
  
  return (
    <>
      <div className={styles.container}>
          <div className={styles.inner}>
              <p className={styles.title}>Descubre el vestido perfecto para cada ocasión.</p>
              <div className={styles.search} ref={inputRef}>
                  <input className={styles.input} type="text" placeholder="Escribe el tipo de vestido ideal." value={searchTerm} onChange={handleSearchTermChange} onClick={(e) => {setIsOpen(false); setStartDateToggle(false);e.stopPropagation() }} 
                  onKeyUp={(e) => {
                    if (filteredSuggestions.length > 0 && e.key === "Enter") {
                      // Si hay sugerencias activas y Enter se presiona, selecciona la sugerencia activa
                      if (activeSuggestionIndex >= 0) {
                        e.preventDefault(); // Previene que el Enter dispare el otro enter
                        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
                      }
                    } else if(e.key == "Enter") {
                      if(startDate.day != null && searchTerm != '' && endDate.day != null) 
                        {setSearchToggle(!searchToggle); setIsSearch(true);}
                        else {
                          Swal.fire({
                            title: '¡Búsqueda incompleta!',
                            text: 'Por favor, ingresa todos los datos de búsqueda y vuelve a intentarlo.',
                            iconHtml: '<img src="busquedaIncompleta.png" style="width: 253px;"/>',
                            customClass: {
                              icon: styles.noBorder,
                              confirmButton: styles.confirmButton,
                            },
                            buttonsStyling: false,
                            confirmButtonText: 'Volver'
                          })
                        };
                    }}}/>
                  {/* Mostrar sugerencias filtradas */}
                  {filteredSuggestions.length > 0 && (
                    <ul className={styles.suggestionsList}>
                      {filteredSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          ref={(el) => (suggestionsRef.current[index] = el)} // Asigna referencia
                          className={`${styles.suggestion} ${index === activeSuggestionIndex ? styles.activeSuggestion : ''}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className={styles.separator}>|</span>
                  <div className={startDateToggle ? styles.dateOuterContainerToggled : styles.dateOuterContainer} onClick={() => {setIsOpen(true); setStartDateToggle(!startDateToggle);}}>
                    <div className={styles.dateContainer}>
                      <span>Alquila</span>
                      <span className={styles.date}>{startDate.day == null ? 'Desde' : startDate.day + '/' + (startDate.month + 1) + '/' + startDate.year}</span>
                    </div>
                    <span onClick={() => {setStartDate({day: null, month: null, year: null}); setEndDate({day: null, month: null, year: null});}}>{startDate.day != null ? 'x' : ''}</span>
                  </div>
                  <span className={styles.separator}>|</span>
                  <div className={styles.dateOuterContainer} onClick={() => setIsOpen(true)}>
                    <div className={styles.dateContainer}>
                      <span>Devuelve</span>
                      <span className={styles.date}>{endDate.day == null ? 'Hasta' : endDate.day + '/' + (endDate.month + 1) + '/' + endDate.year}</span>
                    </div>
                    <span onClick={() => setEndDate({day: null, month: null, year: null})}>{endDate.day != null ? 'x' : ''}</span>
                  </div>
                  <span className={styles.separator}>|</span>
                  <div className={styles.searchButton} onClick={() => {
                    setIsOpen(false);
                    if(startDate.day != null && searchTerm != '' && endDate.day != null) 
                    {setSearchToggle(!searchToggle); setIsSearch(true);}
                    else {
                      Swal.fire({
                        title: '¡Búsqueda incompleta!',
                        text: 'Por favor, ingresa todos los datos de búsqueda y vuelve a intentarlo.',
                        iconHtml: '<img src="busquedaIncompleta.png" style="width: 253px;"/>',
                        customClass: {
                          icon: styles.noBorder,
                          confirmButton: styles.confirmButton,
                        },
                        buttonsStyling: false,
                        confirmButtonText: 'Volver'
                      })
                    };
                  }}>
                    <span>Buscar</span>
                    <img className={styles.lens} src="lens.svg"/>
                  </div>
              </div>
              {isOpen && <div className={styles.calendarContainer} onClick={() => setIsOpen(false)}>
                <div className={styles.calendar} onClick={(e) => e.stopPropagation()}>
                  <Calendar 
                    setStartDate={setStartDate} 
                    setEndDate={setEndDate} 
                    startDate={startDate} 
                    endDate={endDate}
                    startDateToggle={startDateToggle}
                    setStartDateToggle={setStartDateToggle}
                    setIsOpen={setIsOpen}
                  />
                </div>
              </div>}
          </div>
      </div>
      {isSearch && <PaginatedSearchList searchTerm={searchTerm} startDate={startDate} endDate={endDate} searchToggle={searchToggle}/>}
    </>
  )
}

export default Search;