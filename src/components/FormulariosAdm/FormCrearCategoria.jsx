import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";

export default function FormCrearCategoria({ cancelar }) {
  const [nivelC, setNivelC] = useState([]);
  const [validar, setValidar] = useState([]);

  useEffect(() => {
    cargarNivel();
  }, []);

  const cargarNivel = async () => {
    try {
      const rest = await axios.get(`${Url}nivel/`, {
        withCredentials: true,
      });
      setNivelC(rest.data);
    } catch (error) {}
  };
  const [categoria, setCategoria] = useState({
    nombre: "",
    nivel: "0",
  });

  const { nombre, nivel } = categoria;

  const onInputChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validar apellido paterno
    if (nivel == "0") {
      nuevosErrores.nivel = "Selecciona un nivel";
    }

    setValidar(nuevosErrores); // Actualizar el estado de errores
    return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      const categoria2 = {
        ...categoria,
        nivel: Number(categoria.nivel),
      };
      await axios.post(`${Url}crear_categoria/`, categoria2, {
        withCredentials: true,
      });
      cancelar();
    }
  };

  return (
    <div className="flex flex-col bg-[#c7d9f6] items-center">
      <h3 className="">Crear categoria</h3>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center">
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Nombre de la categoria
            </label>
            <input
              type="text"
              className="h-[35px] bg-white rounded-[10px] border-2"
              name="nombre"
              //required
              value={nombre}
              onChange={(e) => onInputChange(e)}
            />
            <p className="h-[15px] text-red-600 text-sm">{validar.nombre}</p>
          </div>
          <div className="flex flex-col p-2.5 justify-center items-center">
            <label className="" htmlFor="">
              Nivel
            </label>
            <select
              value={nivel}
              onChange={(e) => onInputChange(e)}
              name="nivel"
              className="h-[35px] bg-white rounded-[10px] border-2"
            >
              <option value="0">Seleccione un nivel</option>
              {nivelC.map((nivel) => (
                <option key={nivel.id} value={nivel.id}>
                  {nivel.nombre}
                </option>
              ))}
            </select>
            <p className="h-[15px] text-red-600 text-sm">{validar.nivel}</p>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center space-x-2">
          <button
            type="submit"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-blue-700 font-bold text-white cursor-pointer"
          >
            Registrarse
          </button>
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-red-500 font-bold text-white cursor-pointer"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
