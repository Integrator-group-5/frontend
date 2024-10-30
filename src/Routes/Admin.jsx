import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import backButton from '../Images/backArrow.png';
import { useEffect, useState } from "react";
import SidebarButton from "../components/SidebarButton";

const Admin = () => {

    const [products, setProducts] = useState(null);

    useEffect(() => {
        // Llamada a la API para obtener el detalle del producto
        const fetchProducts = async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/products`);
            const data = await response.json();
            setProducts(data);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchProducts();
    }, []);

    if (!products) return <p>Cargando...</p>;

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/products/delete-product/${id}`, {method: "DELETE"});
            location.reload();
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error deleting:", error);
        }
    }

    const hideSidebar = () => {
        document.getElementById("sidebar").classList.toggle(styles.hide);
        document.getElementById("sidebarBody").classList.toggle(styles.hidden);
        document.getElementById("lens").classList.toggle(styles.hidden);
        document.getElementById("backArrow").classList.toggle(styles.rotate);
    }

    return (
        <>
            <div className={styles.notAvailable}>
                <img style={{height: "98px", marginBottom: "20px"}} src="x.svg"/>
                <h1 style={{fontSize: "20px", fontWeight: "bold"}}>No está disponible</h1>
            </div>
            <header className={styles.header}>
                <h1 className={styles.title}>Panel administrativo</h1>
                <Link to="/" className={styles.backButton}> <img src={backButton} alt="Back" /></Link>
            </header>
            <div className={styles.container}>
                <div className={styles.sidebar} id="sidebar">
                    <div className={styles.sidebarHeader}>
                        <img className={styles.sidebarIcon} src="backArrowPurple.png" onClick={hideSidebar} id="backArrow"/>
                        <img className={styles.sidebarIcon} src="lens.svg" id="lens"/>
                    </div>
                    <div className={styles.sidebarBody} id="sidebarBody">
                        <SidebarButton icon="apps.png" title="Agregar"/>
                        <ul className={styles.list}>
                            <li>Producto</li>
                            <li>Categoría</li>
                        </ul>
                        <SidebarButton icon="appsList.svg" title="Listar"/>
                        <ul className={styles.list}>
                            <li>Productos</li>
                            <li>Categorías</li>
                        </ul>
                        <SidebarButton icon="client.svg" title="Cliente"/>
                        <ul className={styles.list}>
                            <li>Satisfacción</li>
                            <li>Reclamos</li>
                        </ul>
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Referencia</th>
                            <th>Color</th>
                            <th>Diseñador</th>
                            <th>Valor</th>
                            <th>Categoría</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {return (
                            <tr key={product.productId}>
                                <td>{product.productId}</td>
                                <td>{product.name}</td>
                                <td>{product.reference}</td>
                                <td>{product.color}</td>
                                <td>{product.designer}</td>
                                <td>{product.price}</td>
                                <td>{product.categories[0].name}</td>
                                <td><img className={styles.prodImage} src={product.images[0].url}/></td>
                                <td>
                                    <div className={styles.actions}>
                                        <img className={styles.action} src="pencil.png"/>
                                        <img className={styles.action} src="trash-can.png" onClick={() => deleteProduct(product.productId)}/>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Admin;