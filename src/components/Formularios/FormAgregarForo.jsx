import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Url } from "../../BackUrl";

export default function FormAgregarForo({ cancelar }) {
  const [nivelC, setNivelC] = useState([]);
  const [validar, setValidar] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {}, []);

  const [publicacion, setpublicacion] = useState({
    titulo: "",
    contenido: "",
    autor: user,
  });
  const { titulo, contenido, autor } = publicacion;

  const onInputChange = (e) => {
    setpublicacion({ ...publicacion, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    // Validar
    if (!titulo.trim()) {
      nuevosErrores.titulo = "El titulo es obligatorio.";
    }

    if (!contenido.trim()) {
      nuevosErrores.contenido = "El contenido no puede estar vacio.";
    }

    setValidar(nuevosErrores); // Actualizar el estado de errores
    return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      await axios.post(`${Url}nueva_publicacion/`, publicacion, {
        withCredentials: true,
      });
      cancelar();
    }
  };

  return (
    <div className="flex flex-col w-[95%] sm:w-[600px] bg-[#c7d9f6] items-center">
      <h3 className="text-xl font-bold">Nueva publicación</h3>

      <form onSubmit={(e) => onSubmit(e)} className="w-full">
        <div className="flex flex-col space-y-3">
          <div className="flex w-full flex-col pl-2 pr-2 sm:pl-5 sm:pr-5 items-start">
            <label className="" htmlFor="">
              Titulo
            </label>
            <input
              type="text"
              className="flex h-[35px] w-full bg-white rounded-[10px] border-2 p-2"
              name="titulo"
              //required
              value={titulo}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[15px] text-red-600 text-sm">{validar.titulo}</p>
          </div>
          <div className="flex w-full flex-col pl-2 pr-2 sm:pl-5 sm:pr-5 items-start">
            <label className="" htmlFor="">
              Contenido
            </label>
            <textarea
              className="w-full h-[100px] bg-white rounded-[10px] border-2 p-2 resize-none"
              name="contenido"
              value={contenido}
              onChange={onInputChange}
            />
            <p className="h-[15px] text-red-600 text-sm">{validar.contenido}</p>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center space-x-2">
          <button
            type="submit"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-blue-700 font-bold text-white cursor-pointer"
          >
            Publicar
          </button>
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-red-500 font-bold text-white cursor-pointer"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
