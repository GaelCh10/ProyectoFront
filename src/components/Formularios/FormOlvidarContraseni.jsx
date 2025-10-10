import React, { useState } from "react";
import logo from "../../assets/IMG/logo.png";
import { NavLink } from "react-router-dom";
import { div } from "@tensorflow/tfjs";
import axios from "axios";
import { Url } from "../../BackUrl";

export default function FormOlvidarContraseni() {
  const [correoR, setCorreoR] = useState({
    email: "",
  });

  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [validar, setValidar] = useState({});

  const { email } = correoR;

  const onInputChange = (e) => {
    setCorreoR({ ...correoR, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = "El correo electrónico no es válido.";
    }
    setValidar(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const onSubmit = async () => {
    if (validarCampos()) {
      try {
        await axios.post(`${Url}solicitar_correo/`, correoR);
        setCorreoEnviado(true);
      } catch (error) {
        alert(`Ocurrió un error al enviar el correo`);
      }
    }
  };
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex bg-[#0b1973] w-full h-32 sm:h-16  text-white sm:items-center  justify-center relative">
        <img src={logo} className="h-[45%] sm:h-[90%] absolute start-5" />

        <h1 className="text-[40px] letraC text-[#fff000] absolute">
          ¡Aprendiendo con señas!
        </h1>
      </div>
      <div className="flex flex-col w-[90%]  p-4 bg-[#c7d9f6] rounded-2xl sm:w-[50%] md:w-[40%] lg:w-[30%] justify-center items-center">
        <div className="flex w-full h-[100px] justify-center mt-[15px] mb-[15px]">
          <img className="w-[100px]" src={logo} />
        </div>
        <h3 className="text-3xl">Recuperar contraseña</h3>
        {!correoEnviado ? (
          <>
            <form>
              <div className="flex flex-col p-[10px] items-center gap-2.5">
                <label className="textoA" htmlFor="">
                  Ingrese su correo
                </label>
                <input
                  type="email"
                  className="w-full h-[35px] outline-none rounded-[10px] border-2 p-2 bg-white"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => onInputChange(e)}
                />
                <p className="h-[18px] text-red-500 text-sm">{validar.email}</p>
              </div>
              <div className="flex mt-2 items-center justify-center ">
                <button
                  type="button"
                  className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-blue-500 text-[18px] hover:bg-blue-600"
                  onClick={onSubmit}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex m-5 flex-col justify-center items-center"><h1 className="font-bold">Correo de recuperación enviado</h1>
          <p>Revise su correo</p></div>
        )}

        <NavLink to={"/"}>Inicio</NavLink>
      </div>
    </div>
  );
}
