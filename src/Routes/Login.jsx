import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loginStyles from "../styles/Login.module.css";
import logo from '../Images/Logo.png';
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import AuthContext from "../context/AuthContext";

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
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok) {
          loginUser(data);
          navigate("/"); // Redirige al inicio después de iniciar sesión
        } else if (response.status === 404) {
          setError({ email: "No encontramos una cuenta asociada a este correo electrónico." });
        } else if (response.status === 401) {
          setError({ password: "La contraseña ingresada es incorrecta. Vuelve a intentarlo." });
        } else {
          setError({ general: " El correo o contraseña ingresados es incorrecto. Vuelve a intentarlo." });
        }
      } catch (error) {
        setModalInfo({
          show: true,
          mensaje: "Por favor, verifica tu conexión a Internet e intenta nuevamente.",
          img: "./ohNo.png"
        });
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
            <label>
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


            <label>
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
