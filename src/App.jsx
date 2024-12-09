import NewHeader from "./components/NewHeader.jsx";
import Detail from "./Routes/Detail.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Routes/Home.jsx";
import appStyles from "./styles/App.module.css";
import Login from "./Routes/Login";
import Register from "./Routes/Register.jsx";
import Search from "./components/Search.jsx";
import { AuthProvider } from "./context/AuthContext";
import ContextProvider from "./context/globalContext.jsx";
import PrivateRoute from "./components/PrivateRoute";
import NewFooter from "./components/NewFooter.jsx";
import PaginatedProductList from "./components/PaginatedProductList";
import NewAdmin from "./Routes/NewAdmin.jsx";
import FavList from "./Routes/FavList.jsx";
import { useState } from "react";
import Checkout from "./Routes/Checkout.jsx";
import WappButton from "./components/WappButton.jsx";
import Pedidos from "./Routes/Pedidos.jsx";
import DetailReservation from "./Routes/DetailReservation.jsx";

function App() {
  const location = useLocation();
  const isLocation = ["/register","/checkout", "/login"].includes(location.pathname)
  const currentPath = location.pathname;
  const [isSearch, setIsSearch] = useState(false);

  return (
    <ContextProvider>
      <AuthProvider>
        {!isLocation && (
          <>
            <NewHeader />
            {currentPath === "/" && (
              <Search isSearch={isSearch} setIsSearch={setIsSearch} />
            )}
          </>
        )}
        <div className={appStyles.container}>
          <Routes>
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/" element={<Home isSearch={isSearch} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/reservation-detail" 
              element={
                <PrivateRoute>
                  <DetailReservation />
                </PrivateRoute>
              } 
            />
            <Route
              path="/favList"
              element={
                <PrivateRoute>
                  <FavList />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <Pedidos />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <NewAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/:categoryName"
              element={<PaginatedProductList />}
            />
          </Routes>
        </div>
        {!isLocation && <NewFooter />}
        {!isLocation && <WappButton />} {/* Aquí se renderiza el botón */}
      </AuthProvider>
    </ContextProvider>
  );
  
}

export default App;
