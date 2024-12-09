import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Table from "../components/Table";
import styles from "../styles/NewAdmin.module.css";
import axiosInstance from "../Utils/axiosInstance";
import { useContextGlobal } from "../context/globalContext";
import ModalConfirm from "./ModalConfirm";

const UserTable = ({ pageSize = 6, reload, setReload }) => {
  //cosas que se deben tener por cada table
  const {state,dispatch}=useContextGlobal();
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [currentPageUser, setCurrentPageUser] = useState(0); // Tracks current page
  const [totalPagesUser, setTotalPagesUser] = useState(0); // Tracks total pages
  const [totalElementsUser, setTotalElementsUser] = useState(0);
  const [numElementsUser, setNumElementsUser] = useState(0);
  const {user, logoutUser } = useContext(AuthContext);
  const axios = axiosInstance();

  // fetch de los usuarios paginados
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/paginated`, {
          params: {
            page: currentPageUser,
            size: pageSize,
          },
        });

        const data = response.data;
        console.log("contenido de paginado", data);
        console.log("usuario",user)
        dispatch({type:"GET_USERS", payload:data.content})
        dispatch({type:"INITIALIZE_SHOWACTIONS", payload:data.content.map(()=>false)}) //inicializo los menu de accion
        setTotalPagesUser(data.totalPages); // Set total pages from response
        setTotalElementsUser(data.totalElements);
        setNumElementsUser(data.numberOfElements);
      } catch (err) {
        dispatch({type:"SET_ERROR", payload:"Error fetching users"})
      }
    };

    fetchUser();
  }, [currentPageUser, reload]);

  const handlePageChangeUser = (page) => {
    setCurrentPageUser(page);
  };

  const startRangeUser = currentPageUser * pageSize + 1;
  const endRangeUser = Math.min(startRangeUser + numElementsUser - 1, totalElementsUser);

  const handleDeleteClickUser = (id) => {
    dispatch({type:"GET_ID",payload:id})
    dispatch({type:"SHOW_MODAL"})
  };


  const confirmDeleteUser = async () => {
    try {
      await axios.delete(
        `/api/v1/users/delete-user/${state.selectedId}`
      );
      dispatch({type:"DELETE_USERS",payload:state.selectedId})
      dispatch({type: "HIDDEN_MODAL"})
      setReload((prev) => !prev); // Actualizar la tabla
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleClickAdmin = (email, role) => {
    setSelectedUserEmail(email);
    setSelectedUserRole(role);
    setShowModalAdmin(true);
  };

  const confirmChangePermissions = async () => {
    try {
      if (selectedUserRole == "ADMIN")
        await axios.put(`/api/v1/users/remove-admin`, {
          email: selectedUserEmail,
        });
      else
        await axios.put(`/api/v1/users/set-admin`, {
          email: selectedUserEmail,
        });
      setShowModalAdmin(false);
      setReload((prev) => !prev); // Actualizar la tabla

      // Si se quitó el rol "ADMIN" y el usuario actual es el mismo que el modificado
      if (selectedUserRole === "ADMIN" && user.email === selectedUserEmail) {
      console.log("Se quitó el rol ADMIN al usuario actual, cerrando sesión...");
      logoutUser(); // Desloguea al usuario actual
      }
    } catch (error) {
      console.error("Error setting permissions:", error);
    }
  };

  const handleShowActionsUsers = (i) => {
    dispatch({type:"TOGGLE_SHOW_ACTIONS", payload:i})
  };

  return (
    <>

      {state.showModal &&(
        <ModalConfirm
        title="¿Estás seguro de que deseas eliminar este usuario?"
        onClick={confirmDeleteUser}
        onClick2={() => dispatch({ type: "HIDDEN_MODAL"})}
        />
      )}
      {showModalAdmin &&(
        <ModalConfirm
        title="¿Estás seguro de que deseas cambiar los permisos de este usuario?"
        onClick={confirmChangePermissions}
        onClick2={() => setShowModalAdmin(false)}
        />
      )}
      <Table
        headers={["ID", "Nombre", "Apellido", "Email", "Rol"]}
        rows={state.usersPaginados.map((user) => ({
          ID: user.userId,
          Nombre: user.first_name,
          Apellido: user.last_name,
          Email: user.email,
          Rol: user.userRole,
        }))}
        renderActions={(row, idx) => (
          <td className={styles.cells}>
            <div className={styles.actions}>
              <img
                className={styles.dots}
                src="dots.png"
                onClick={() => handleShowActionsUsers(idx)} // Correctamente llama a la función
              />
            </div>
            {state.showActions[idx] && (
              <div
                className={styles.actionsMenuContainer}
                onClick={() => handleShowActionsUsers(idx)}
              >
                <div className={styles.actionsMenuUser}>
                  <span
                    className={styles.action}
                    onClick={() => handleClickAdmin(row.Email, row.Rol)}
                  >
                    Permisos
                  </span>
                  <span
                    className={styles.action}
                    onClick={() => handleDeleteClickUser(row.ID)}
                  >
                    Eliminar
                  </span>
                </div>
              </div>
            )}
          </td>
        )}
        showActions={state.showActions}
        handleShowActions={handleShowActionsUsers}
        currentPage={currentPageUser}
        onPageChange={handlePageChangeUser}
        totalPages={totalPagesUser}
        startRange={startRangeUser}
        endRange={endRangeUser}
        totalElements={totalElementsUser}
      />
    </>
  );
};

export default UserTable;
