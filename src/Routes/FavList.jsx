import React, { useState, useEffect } from "react";
import useAxios from "../Utils/axiosInstance"; // Custom Axios instance
import Pagination from "../components/Pagination";
import styles from "../styles/FavList.module.css";
import CardProduct from "../components/CardProduct";

const FavList = ({ pageSize = 6 }) => {
    const axios = useAxios();
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reload,setReload]= useState(false);
    const baseUrl= import.meta.env.VITE_API_BASE_URL

    // Fetch favorite products
    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `/api/v1/users/favorites`,
                { params: { page: currentPage, size: pageSize } }
            );
            const data = response.data;
            setFavorites(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            setError("Error al obtener los favoritos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [currentPage,reload]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.favListContainer}>
            <h2 className={styles.title}>Tus Productos Favoritos</h2>

            {/* Loading and Error states */}
            {loading && <p>Cargando favoritos...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && favorites.length === 0 && (
                <p className={styles.noFavorites}>No tienes productos favoritos.</p>
            )}
            <CardProduct products={favorites} onToggle={() => setReload((prev) => !prev)}/>

            <div className={styles.paginationContainer}>
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default FavList;
