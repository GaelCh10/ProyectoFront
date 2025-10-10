import React, { useState } from "react";
import logo from "../../assets/IMG/logo.png";
import axios from "axios";
import { Url } from "../../BackUrl";
export default function FormCrearCuenta({ cancelar }) {
  const [usuario, setUsuario] = useState({
    username: "",
    password: "",
    repassword: "",
    email: "",
    rol: 2,
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    sexo: "",
    fecha_nacimiento: "",
  });

  const [validar, setValidar] = useState({});

  const {
    username,
    password,
    repassword,
    email,
    nombre,
    apellido_p,
    apellido_m,
    sexo,
    fecha_nacimiento,
  } = usuario;

  const fechaActual = new Date();
  const fechaMaxima = new Date(fechaActual);
  fechaMaxima.setFullYear(fechaActual.getFullYear() - 5);
  const fechaMaximaFormateada = fechaMaxima.toISOString().split("T")[0];

  const onInputChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validar apellido paterno
    if (!apellido_p.trim()) {
      nuevosErrores.apellido_p = "El apellido paterno es obligatorio.";
    }

    // Validar apellido materno
    if (!apellido_m.trim()) {
      nuevosErrores.apellido_m = "El apellido materno es obligatorio.";
    }

    // Validar fecha de nacimiento
    if (!fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = "La fecha de nacimiento es obligatoria.";
    } else if (new Date(fecha_nacimiento) > fechaMaxima) {
      nuevosErrores.fecha_nacimiento =
        "La fecha de nacimiento no puede ser posterior a hace 5 años.";
    }

    // Validar sexo
    if (!sexo) {
      nuevosErrores.sexo = "Debes seleccionar un sexo.";
    }

    // Validar email
    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = "El correo electrónico no es válido.";
    }

    // Validar nombre de usuario
    if (!username.trim()) {
      nuevosErrores.username = "El nombre de usuario es obligatorio.";
    }

    if (!password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/\d/.test(password)) {
      nuevosErrores.password = "La contraseña debe incluir al menos un número.";
    }

    // Validar confirmación de contraseña
    if (!repassword.trim()) {
      nuevosErrores.repassword = "Debes confirmar la contraseña.";
    } else if (repassword !== password) {
      nuevosErrores.repassword = "Las contraseñas no coinciden.";
    }

    setValidar(nuevosErrores); // Actualizar el estado de errores
    return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validarCampos()) {
      const originalAuthHeader = axios.defaults.headers.common["Authorization"];

      delete axios.defaults.headers.common["Authorization"];

      try {
        await axios.post(`${Url}registro/`, usuario);
        cancelar();
      } finally {
        axios.defaults.headers.common["Authorization"] = originalAuthHeader;
      }
    }
  };

  return (
    <div className="flex sm:w-[50%] flex-col bg-[#c7d9f6] items-center">
      <div className="flex w-full h-[100px] justify-center">
        <img className="w-[100px] h-auto" src={logo} />
      </div>
      <h3 className="">Crear cuenta</h3>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center ">
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Nombre
            </label>
            <input
              type="text"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="nombre"
              //required
              value={nombre}
              onChange={(e) => onInputChange(e)}
            />

            <p className="h-[10px] text-red-500 text-sm">{validar.nombre}</p>
          </div>
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Apellido Paterno
            </label>
            <input
              type="text"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="apellido_p"
              //required
              value={apellido_p}
              onChange={(e) => onInputChange(e)}
            />

            <p className="h-[10px] text-red-500 text-sm">
              {validar.apellido_p}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Apellido Materno
            </label>
            <input
              type="text"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="apellido_m"
              //required
              value={apellido_m}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[10px] text-red-500 text-sm">
              {validar.apellido_m}
            </p>
          </div>
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="fecha_nacimiento"
              //required
              value={fecha_nacimiento}
              onChange={(e) => onInputChange(e)}
              max={fechaMaximaFormateada}
            />
            <p className="h-[10px] text-red-500 text-sm">
              {validar.fecha_nacimiento}
            </p>
          </div>
        </div>
        <div className="flex flex-col p-2.5 justify-center items-center">
          <label>Sexo</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sexo"
                value="H"
                checked={sexo === "H"}
                className="w-4 h-4"
                onChange={(e) => onInputChange(e)}
              />
              Hombre
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sexo"
                value="M"
                checked={sexo === "M"}
                className="w-4 h-4"
                onChange={(e) => onInputChange(e)}
              />
              Mujer
            </label>
          </div>
          <p className="h-[10px] text-red-500 text-sm">{validar.sexo}</p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Correo Electronico
            </label>
            <input
              type="email"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="email"
              //required
              value={email}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[10px] text-red-500 text-sm">{validar.email}</p>
          </div>
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Nombre de usuario
            </label>
            <input
              type="text"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="username"
              //required
              value={username}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[10px] text-red-500 text-sm">{validar.username}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Contraseña
            </label>
            <input
              type="password"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="password"
              //required
              value={password}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[10px] text-red-500 text-sm">{validar.password}</p>
          </div>
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2"
              name="repassword"
              //required
              value={repassword}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[10px] text-red-500 text-sm">
              {validar.repassword}
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center space-x-2">
          <button
            type="submit"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-blue-500 cursor-pointer hover:bg-blue-600"
          >
            Registrarse
          </button>
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-[#72a0e8]"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
