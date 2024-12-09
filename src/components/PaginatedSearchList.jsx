import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/PaginatedProductList.module.css";
import { formatCurrency } from "../Utils/currencyFormatter";
import HeartButton from "./HeartButton";
import Pagination from "./Pagination";
import useAxios from "../Utils/axiosInstance";
import DetailHeader from "./DetailHeader";

const PaginatedSearchList = ({ pageSize = 6, searchTerm, startDate, endDate, searchToggle }) => {
  const { categoryName } = useParams(); // Get categoryName from URL
  const { state } = useLocation(); // Get state from navigation

  const navigate = useNavigate();

  const categoryDescription = state?.categoryDescription || ""; // Get categoryDescription from state

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
        const response = await axios.get(`/api/v1/products/paginated`, {
          params: {
            page: currentPage,
            size: pageSize,
            category: categoryName || "",
            search: searchTerm,
            startDate: startDate.year + '-' + ('0' + (startDate.month + 1)).slice(-2) + '-' + ('0' + startDate.day).slice(-2),
            endDate: endDate.year + '-' + ('0' + (endDate.month + 1)).slice(-2) + '-' + ('0' + endDate.day).slice(-2)
          },
        });

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
    navigate(`/detail/${productId}`); // Navigate to the detail page with productId
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the range of products displayed
  const startRange = currentPage * pageSize + 1;
  const endRange = Math.min(startRange + numElements - 1, totalElements);

  return (
    <div className={styles.productListContainer}>
      {categoryName ? (
        <DetailHeader title={categoryName}/>
      ) : (
        <h2 className={styles.titulo}>{"Resultados de la búsqueda"}</h2>
      )}

      {categoryDescription && <h3>{categoryDescription}</h3>} {/* Show subtitle only if provided */}

      {/* Display total and current product count */}
      <p className={styles.paginationInfo}>
        Mostrando {startRange}-{endRange} de {totalElements} productos {categoryName && "con categoría " + categoryName} (Página {currentPage + 1} de {totalPages})
      </p>

      {products.length == 0 && <div style={{textAlign: 'center'}}>
        <img src="/ohNo2.png" alt={"Cero resultados"} style={{width: '300px'}}/>
        <h2>No hay resultados para tu búsqueda.</h2>
      </div>}

      {/* Loading and Error states */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Display Products */}
      <div className={styles.products}>
        {products.map((product) => (
          <div
            key={product.productId}
            className={styles.productCard}
            onClick={() => handleCardClick(product.productId)}
          >
            <HeartButton id={product.productId} className={styles.heart}/>
            <img
              src={`${baseUrl}${product.images[0].url}`}
              alt={product.name}
              className={styles.productImage}
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
      <Pagination
        currentPage={currentPage}
        totalPage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginatedSearchList;
