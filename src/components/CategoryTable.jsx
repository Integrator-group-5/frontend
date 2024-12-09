import React, { useEffect, useRef, useState } from "react";
import Table from "../components/Table";
import styles from "../styles/NewAdmin.module.css";
import axiosInstance from "../Utils/axiosInstance";
import { useContextGlobal } from "../context/globalContext";
import ModalConfirm from "./ModalConfirm";

const CategoryTable = ({ pageSize = 6,reload,setReload }) => {
  //cosas que se deben tener por cada table
  const {state,dispatch}=useContextGlobal();
  const [currentPageCategories, setCurrentPageCategories] = useState(0); // Tracks current page
  const [totalPagesCategories, setTotalPagesCategories] = useState(0); // Tracks total pages
  const [totalElementsCategories, setTotalElementsCategories] = useState(0);
  const [numElementsCategories, setNumElementsCategories] = useState(0);
  const axios = axiosInstance();
  const baseUrl=import.meta.env.VITE_API_BASE_URL
  

  // fetch de los categorias paginados
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`/api/v1/categories/paginated`, {
          params: {
            page: currentPageCategories,
            size: pageSize,
          },
        });

        const data = response.data;
        dispatch({type:"GET_CATEGORIES", payload: data.content})
        dispatch({type:"INITIALIZE_SHOWACTIONS", payload:data.content.map(()=>false)}) //inizializar los menu de accion
        setTotalPagesCategories(data.totalPages); // Set total pages from response
        setTotalElementsCategories(data.totalElements);
        setNumElementsCategories(data.numberOfElements);
      } catch (err) {
        dispatch({type:"SET_ERROR", payload:"Error fetching categoria" })
      }
    };

    fetchCategoria();
  }, [currentPageCategories, reload]);


  const startRangeCategories = currentPageCategories * pageSize + 1;
  const endRangeCategories = Math.min(
    startRangeCategories + numElementsCategories - 1,
    totalElementsCategories
  );

  const handlePageChangeCategories = (page) => {
    setCurrentPageCategories(page);
  };

  const handleDeleteClickCategorie = (id) => {
    dispatch({type:"GET_ID",payload:id})
    dispatch({type:"SHOW_MODAL"})
  };
  const handleShowActionsCategorie = (i) => {
    dispatch({type:"TOGGLE_SHOW_ACTIONS", payload:i})
  };


  const confirmDeleteCategories = async () => {
    try {
      await axios.delete(
        `/api/v1/categories/delete-category/${state.selectedId}`
      );
      dispatch({type:"DELETE_CATEGORY",payload: state.selectedId}) //elimina la categoria de la lista
      dispatch({type:"HIDDEN_MODAL"}) //se cierra el modal
      setReload((prev) => !prev); // Actualizar la tabla
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <>
      {state.showModal && (
        <ModalConfirm
        title="¿Estás seguro de que deseas eliminar esta categoria?"
        onClick={confirmDeleteCategories}
        onClick2={() => dispatch({type:"HIDDEN_MODAL"})}
        />
      )}
      <Table
        headers={["ID", "Nombre", "Descripción", "Imagen"]}
        rows={state.categoriesPaginados.map((categorie) => ({
          ID: categorie.id,
          Nombre: categorie.name,
          Description: categorie.description,
          Image: (
            <div className={styles.containerImage}>
              <img
                className={styles.prodImage}
                src={`${baseUrl}${categorie.cover.url}`}
                alt={categorie.name}
                onError={(e) => {
                  e.target.src = "placeholder.svg"; // Fallback image
                  e.target.onerror = null; // Prevent infinite fallback loop
                }}
              />
            </div>
          ),
        }))}
        renderActions={(row, idx) => (
          <td className={styles.cells}>
            <div className={styles.actions}>
              <img
                className={styles.dots}
                src="dots.png"
                onClick={() => handleShowActionsCategorie(idx)} // Correctamente llama a la función
              />
            </div>
            {state.showActions[idx] && (
              <div
                className={styles.actionsMenuContainer}
                onClick={() => handleShowActionsCategorie(idx)}
              >
                <div className={styles.actionsMenuCategorie}>
                  <span
                    className={styles.action}
                    onClick={() => handleDeleteClickCategorie(row.ID)}
                  >
                    Eliminar
                  </span>
                </div>
              </div>
            )}
          </td>
        )}
        showActions={state.showActions}
        handleShowActions={handleShowActionsCategorie}
        currentPage={currentPageCategories}
        onPageChange={handlePageChangeCategories}
        totalPages={totalPagesCategories}
        startRange={startRangeCategories}
        endRange={endRangeCategories}
        totalElements={totalElementsCategories}
      />
    </>
  );
};

export default CategoryTable;
