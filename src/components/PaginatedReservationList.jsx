import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/PaginatedProductList.module.css";
import Pagination from "./Pagination";
import useAxios from "../Utils/axiosInstance";
import DetailHeader from "./DetailHeader";

const PaginatedReservationList = ({ pageSize = 6, searchToggle }) => {
  const { categoryName } = useParams(); // Get categoryName from URL

  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // Stores product data
  const [currentPage, setCurrentPage] = useState(0); // Tracks current page
  const [totalPages, setTotalPages] = useState(0); // Tracks total pages
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [totalElements, setTotalElements] = useState(0);
  const [numElements, setNumElements] = useState(0);
  const axios = useAxios();
  const baseUrl=import.meta.env.VITE_API_BASE_URL;

  // Fetch products for the current page
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error

      try {
        const response = await axios.get(`/api/v1/reservations/user-reservations`, {
          params: {
            page: currentPage,
            size: pageSize,
          },
        });
        console.log("response",response.data);
        const data = response.data;
        setProducts(data.content); // Set product data
        setTotalPages(data.totalPages); // Set total pages from response
        setTotalElements(data.totalElements);
        setNumElements(data.numberOfElements);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Error fetching products"); // Set error if request fails
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName, currentPage, searchToggle]);

  const handleCardClick = (productId) => {
    navigate(`/reservation-detail`, {state: {productId}}); // Navigate to the detail page with productId
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the range of products displayed
  const startRange = currentPage * pageSize + 1;
  const endRange = Math.min(startRange + numElements - 1, totalElements);

  return (
    <div className={styles.productListContainer2}>
      {categoryName ? (
        <DetailHeader title={categoryName}/>
      ) : (
        <h2 className={styles.titulo}>{"Tus reservas"}</h2>
      )}

      {<h3 style={{fontWeight: 'normal'}}>{"Esta es la lista completa de tus reservas; puedes consultar del detalle de cada una."}</h3>} {/* Show subtitle only if provided */}

      {/* Display total and current product count */}
      <p className={styles.paginationInfo}>
        Mostrando {startRange}-{endRange} de {totalElements} productos {categoryName && "con categoría " + categoryName} (Página {currentPage + 1} de {totalPages})
      </p>

      {/* Loading and Error states */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Display Products */}
      <div className={styles.reservations}>
        {products.map((reservation) => (
          <div key={reservation.id} style={{height: '362px', width: '331px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center', borderRadius: '12px'}}>
            <div style={{
              backgroundColor: '#5E548E', 
              color: 'white', fontSize: '20px', 
              fontWeight: 'bold', height: '52px', 
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', borderRadius: '12px 12px 0 0',
              width: '100%'
            }}>
              {reservation.productName}
            </div>
            <div style={{display: 'flex', padding: '10px', backgroundColor: 'white', justifyContent: 'space-between', width: '100%', marginTop: '10px'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <p style={{fontWeight: 'bold'}}>Número de orden:</p>
                <p>{reservation.reservationCode}</p>
                <p style={{fontWeight: 'bold'}}>Fecha de entrega:</p>
                <p>{reservation.startDate}</p>
                <p style={{fontWeight: 'bold'}}>Fecha de devolución:</p>
                <p>{reservation.endDate}</p>
                <p style={{fontWeight: 'bold'}}>Método de entrega:</p>
                <p>{reservation.shippingMethod}</p>
              </div>
              <div style={{
                width: '158px', height: '194px', 
                overflow: 'hidden', display: 'flex', 
                justifyContent: 'center', borderRadius: '12px'
              }}>
                <img style={{flexShrink: '0', minWidth: '100%', minHeight: '100%', objectFit: 'cover'}} 
                  src={`${baseUrl}` + reservation.productImageUrl}
                  alt={reservation.productName}
                  className={styles.productImage2}
                  onError={(e) => {
                    const fallback1 = `${urlAPI}/${mainImage}`;
                    const fallback2 = `${urlAPI}/public${mainImage}`;
                    const fallback3 = "placeholder.svg";
                    if (e.target.src === `${urlAPI}${mainImage}`) {
                      e.target.src = fallback1;
                    } else if (e.target.src === fallback1) {
                      e.target.src = fallback2;
                    } else if (e.target.src === fallback2) {
                      e.target.src = fallback3;
                    } else {
                      e.target.onerror = null;
                    }
                  }}/>
              </div>
            </div>
            <button 
              style={{
                backgroundColor: '#C3B2FB', 
                padding: '10px', width: '304px', 
                height: '36px', borderRadius: '12px', 
                marginTop: '10px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => handleCardClick(reservation.id)}
            >Ver detalle</button>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginatedReservationList;
