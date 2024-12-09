import { useState } from "react";
import StyleRegistro from "../styles/registro.module.css";
import logo from "../Images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Modal from "../components/Modal";

const Register = () => {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    contraseñaRepetida: "",
  });
  const [error, setError] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    contraseñaRepetida: "",
  });

  const [modalInfo, setModalInfo] = useState({
    show: false,
    titulo: "",
    subtitulo: "",
    mensaje: "",
    img: "",
  });
  const navigate = useNavigate();
  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const noNumbersRegex = /^[^\d]*$/;
  const baseUrl=import.meta.env.VITE_API_BASE_URL;
  const url = `${baseUrl}/auth/register`;

  const handleNombre = (e) => {
    setUser({ ...user, nombre: e.target.value });
    setError({ ...error, nombre: "" }); // Limpiar el error al cambiar el valor
  };
  const handleApellido = (e) => {
    setUser({ ...user, apellido: e.target.value });
    setError({ ...error, apellido: "" });
  };
  const handleCorreo = (e) => {
    setUser({ ...user, correo: e.target.value });
    setError({ ...error, correo: "" });
  };
  const handleContraseña = (e) => {
    setUser({ ...user, contraseña: e.target.value });
    setError({ ...error, contraseña: "" });
  };
  const handleRepetida = (e) => {
    setUser({ ...user, contraseñaRepetida: e.target.value });
    setError({ ...error, contraseñaRepetida: "" });
  };

  const handdleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    let formIsValid = true;
     // Validaciones para el nombre
     if (!user.nombre.trim()) {
      errors.nombre = "El campo de nombre no puede estar vacío.";
      formIsValid = false;
    } else if (user.nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres.";
      formIsValid = false;
    } else if (!noNumbersRegex.test(user.nombre)) {
      errors.nombre = "El nombre no puede contener caracteres especiales o números.";
      formIsValid = false;
    }
    // Validaciones para el apellido
    if (!user.apellido.trim()) {
      errors.apellido = "El campo de apellido no puede estar vacío.";
      formIsValid = false;
    } else if (user.apellido.trim().length < 3) {
      errors.apellido = "El apellido debe tener al menos 3 caracteres.";
      formIsValid = false;
    } else if (!noNumbersRegex.test(user.apellido)) {
      errors.apellido = "El apellido no puede contener caracteres especiales o números.";
      formIsValid = false;
    }

    // Validaciones para el correo
    if (!user.correo.trim()) {
      errors.correo = "El campo de correo electrónico no puede estar vacío.";
      formIsValid = false;
    } else if (!emailRegex.test(user.correo)) {
      errors.correo = "Ingresa un correo electrónico válido.";
      formIsValid = false;
    } else if (user.correo.includes("..")) {
      errors.correo = "El correo electrónico parece incorrecto. Revisa el formato.";
      formIsValid = false;
    }
    // Validaciones para la contraseña
    if (!user.contraseña.trim()) {
      errors.contraseña = "El campo de contraseña no puede estar vacío.";
      formIsValid = false;
    } else if (user.contraseña.includes(" ")) {
      errors.contraseña = "La contraseña no puede contener espacios.";
      formIsValid = false;
    } else if (user.contraseña.length < 6) {
      errors.contraseña = "La contraseña debe tener mínimo 6 caracteres.";
      formIsValid = false;
    }
    // Validaciones para repetir la contraseña
    if (!user.contraseñaRepetida.trim()) {
      errors.contraseñaRepetida = "El campo de repetir contraseña no puede estar vacío.";
      formIsValid = false;
    } else if (user.contraseñaRepetida !== user.contraseña) {
      errors.contraseñaRepetida = "Las contraseñas no coinciden. Verifícalas y vuelve a intentarlo.";
      formIsValid = false;
    }
    setError(errors);

    if (formIsValid) {
      const body = {
        first_name: user.nombre.trim(),
        last_name: user.apellido.trim(),
        email: user.correo,
        password: user.contraseña,
      };

      const settings = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await realizarRegister(settings);
        e.target.reset();
      } catch (err) {
        console.error("Error during form submission:", err);
      }
    }
  };

  async function realizarRegister(settings) {
    try {
      const response = await fetch(url, settings);

      // Handle non-201 status codes
      if (response.status == 201) {
        setModalInfo({
          show: true,
          titulo: "¡Felicidades!",
          subtitulo: "Tu registro ha sido exitoso.",
          mensaje:
            "Te hemos registrado correctamente en nuestra web. Ahora puedes acceder a todas las funciones y beneficios que ofrecemos.",
          img: "./Estrellas.svg",
        }); //mostrar el mensaje de exito
      } else {
        const errorMessages = {
          409: "Ya hay un usuario creado con ese correo electrónico.",
          400: "Solicitud inválida. Por favor, verifica los datos ingresados.",
          500: "Error del servidor. Por favor, intenta más tarde.",
        };

        const message =
          errorMessages[response.status] ||
          `Ocurrió un error inesperado (Código: ${response.status}).`;
        setModalInfo({
          show: true,
          img: "./ohNo.png",
          titulo: "Error",
          subtitulo: "Ha ocurrido un problema.",
          mensaje: message,
        });
      }

      // Parse the successful response
      const data = await response.json();
      console.log(data);
    } catch (err) {
      // Handle network or other fetch errors
      setModalInfo({
        show: true,
        titulo: "Error de conexión",
        subtitulo: "Hubo un problema con la conexión.",
        mensaje:
          "Por favor, verifica tu conexión a Internet e intenta nuevamente.",
        img: "./ohNo.png",
      });
      console.error("Error al realizar el registro:", err);
    }
  }
  const handleLogin=()=>{
    navigate("/login", {state:{from:"/register"}})
  }

  return (
    <div className={StyleRegistro.container}>
      <div className={StyleRegistro.containerFoto}>
        <div className={StyleRegistro.containerFiltro}>
          <Link to="/">
            <img src={logo} alt="app logo" className={StyleRegistro.img} />
          </Link>
        </div>
      </div>
      <div className={StyleRegistro.contenedorForm}>
        {modalInfo.show ? (
          <Modal
            img={modalInfo.img}
            titulo={modalInfo.titulo}
            subtitulo={modalInfo.subtitulo}
            mensaje={modalInfo.mensaje}
            onClose={() => {
              setModalInfo({ ...modalInfo, show: false });
              if (modalInfo.titulo === "¡Felicidades!") {
                navigate("/login", { state: { from: "/register" } });
              }
            }}
          />
        ) : (
          <div className={StyleRegistro.formulario}>
            <h2>Registro de cuenta</h2>
            <form onSubmit={handdleSubmit} className={StyleRegistro.registro}>
              <Input
                id="nombre"
                label="Nombre"
                placeholder="Ingresa tu nombre"
                type="text"
                value={user.nombre}
                onChange={handleNombre}
                error={error.nombre}
              />

              <Input
                id="apellidos"
                label="Apellido"
                placeholder="Ingresa tu Apellido"
                type="text"
                value={user.apellido}
                onChange={handleApellido}
                error={error.apellido}
              />

              <Input
              
                label="Correo Eléctronico"
                id="correo"
                placeholder="Ingresa tu correo electronico"
                type="text"
                value={user.correo}
                onChange={handleCorreo}
                error={error.correo}
              />

              <Input
                label="Contraseña"
                id="contraseña"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={user.contraseña}
                onChange={handleContraseña}
                error={error.contraseña}
              />

              <Input
                label="Repetir Contraseña"
                id="repetir"
                placeholder="Ingresa nuevamente tu contraseña"
                type="password"
                value={user.contraseñaRepetida}
                onChange={handleRepetida}
                error={error.contraseñaRepetida}
              />
              <Button>Registrar</Button>
              <p className={StyleRegistro.cuenta}>¿Ya tienes una cuenta? <strong className={StyleRegistro.link} onClick={handleLogin}>Inicia sesión aquí</strong></p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
