import axios from "axios";
import React, { useState } from "react";
import { Url } from "../../BackUrl";
import logo from "../../assets/IMG/logo.png";
import { NavLink, useParams } from "react-router-dom";

export default function FormCambiarContrasenia() {
  const { uid, token } = useParams();

  const [correoR, setCorreoR] = useState({
    password: "",
    repassword: "",
    uid: uid,
    token: token,
  });

  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [validar, setValidar] = useState({});

  const { password, repassword } = correoR;

  const onInputChange = (e) => {
    setCorreoR({ ...correoR, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!repassword.trim()) {
      nuevosErrores.repassword = "Debes confirmar la contraseña.";
    } else if (repassword !== password) {
      nuevosErrores.repassword = "Las contraseñas no coinciden.";
    }

    setValidar(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const onSubmit = async () => {
    if (validarCampos()) {
      try {
        await axios.post(`${Url}cambiar_contrasenia/`, correoR);
        setCorreoEnviado(true);
      } catch (error) {
        alert(`Ocurrió al cambiar la contraseña`);
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
        <h3 className="text-3xl">Cambiar contraseña</h3>
        {!correoEnviado ? (
          <>
            <form>
              <div className="flex flex-col p-[10px] items-center gap-2.5">
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label className="" htmlFor="">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    className="h-[35px] bg-white rounded-[10px] border-2"
                    name="password"
                    //required
                    value={password}
                    onChange={(e) => onInputChange(e)}
                  />
                  <p className="h-[15px] text-red-500 text-sm">{validar.password}</p>
                </div>
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label className="" htmlFor="">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className="h-[35px] bg-white rounded-[10px] border-2"
                    name="repassword"
                    //required
                    value={repassword}
                    onChange={(e) => onInputChange(e)}
                  />
                  <p className="h-[15px] text-red-500 text-sm">{validar.repassword}</p>
                </div>
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
          <div className="flex m-5 flex-col justify-center items-center">
            <h1 className="font-bold">Contraseña actualizada correctamente</h1>
          </div>
        )}

        <NavLink to={"/"}>Inicio</NavLink>
      </div>
    </div>
  );
}
