import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginStyles from "../styles/Login.module.css";
import logo from '../Images/Logo.png';
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", general: "" });
  const [modalInfo, setModalInfo] = useState({
    show: false,
    titulo: "",
    subtitulo: "",
    mensaje: "",
    img: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl=import.meta.env.VITE_API_BASE_URL;

  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    let errors = {};
    let formIsValid = true;

    // Validación de correo
    if (!email) {
      errors.email = "Por favor, ingresa tu correo electrónico.";
      formIsValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      errors.email = "El correo electrónico parece incorrecto. Revisa el formato.";
      formIsValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Ingresa un correo electrónico válido.";
      formIsValid = false;
    }

    // Validación de contraseña
    if (!password) {
      errors.password = "Por favor, ingresa tu contraseña.";
      formIsValid = false;
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
      formIsValid = false;
    }

    setError(errors);

    if (formIsValid) {
      try {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        const previousPage = location.state?.from || document.referrer;
        if (response.ok) {
          loginUser(data);
          const previousPage = location.state?.from || document.referrer; // Obtener página anterior
          if(previousPage?.includes("/register")){
            navigate("/")
          }else{
            navigate(-1);
          }
        } else if (response.status === 404) {
          setError({ email: "No encontramos una cuenta asociada a este correo electrónico." });
        } else if (response.status === 401) {
          setError({ password: "La contraseña ingresada es incorrecta. Vuelve a intentarlo." });
        } else {
          setError({ general: " El correo o contraseña ingresados es incorrecto. Vuelve a intentarlo." });
        }
      } catch (error) {
        Swal.fire({
          title: '¡No se puede iniciar sesión!',
          text: 'Hubo un problema con el inicio de sesión. Por favor, vuelve a intentarlo más tarde.',
          iconHtml: '<img src="ohNo2.png" style="width: 253px;"/>',
          customClass: {
            icon: loginStyles.noBorder,
            confirmButton: loginStyles.confirmButton,
          },
          buttonsStyling: false,
          confirmButtonText: 'Aceptar'
        })
        console.error("Error al iniciar sesión:", error);
      }
    }
  };


  return (
    <div className={loginStyles.loginWrapper}>
      <div className={loginStyles.leftSide}>
        <a href="/" ><img src={logo} alt="Logo" className={loginStyles.logo} /></a>
      </div>
      <div className={loginStyles.rightSide}>
        <div className={loginStyles.loginContainer}>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin} noValidate>
            <label style={{textAlign: 'left'}}>
              Correo electrónico
              <Input
                placeholder="Por favor, ingresa tu correo electrónico."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.email}
                required
                className={loginStyles.inputsLogin}
              />
            </label>


            <label style={{textAlign: 'left'}}>
              Contraseña
              <Input
                placeholder="Por favor, ingresa tu contraseña."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error.password}
                required
                className={loginStyles.inputsLogin}
              />
            </label>

            {error.general && (
              <p className={loginStyles.errorMessage}>{error.general}</p>
            )}

            <Button type="submit">Iniciar sesión</Button>
          </form>

          <p className={loginStyles.signupText}>
            ¿No tienes cuenta? <a href="/register" className={loginStyles.signupLink}>Regístrate aquí</a>
          </p>

          {modalInfo.show && (
            <Modal
              img={modalInfo.img}
              titulo={modalInfo.titulo}
              subtitulo={modalInfo.subtitulo}
              mensaje={modalInfo.mensaje}
              onClose={() => setModalInfo({ ...modalInfo, show: false })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
