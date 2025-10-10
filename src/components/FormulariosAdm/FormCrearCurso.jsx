import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";
import axios from "axios";

export default function FormCrearCurso({ cancelar, recargar, cursoEditar }) {
  const [categoriaC, setCategoriaC] = useState([]);
  const [validar, setValidar] = useState([]);

  useEffect(() => {
    cargarCategoria();
  }, []);

  const cargarCategoria = async () => {
    try {
      const rest = await axios.get(`${Url}categoria/`, {
        withCredentials: true,
      });
      setCategoriaC(rest.data);
    } catch (error) {}
  };
  const [curso, setCurso] = useState(
    cursoEditar || {
      titulo: "",
      descripcion: "",
      categoria: "0",
    }
  );

  const { titulo, descripcion, categoria } = curso;

  const onInputChange = (e) => {
    setCurso({ ...curso, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!titulo.trim()) {
      nuevosErrores.titulo = "El nombre es obligatorio.";
    }

    if (categoria === "0") {
      nuevosErrores.categoria = "Seleccione una categoria";
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripcion es obligatoria";
    }

    setValidar(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      if (cursoEditar) {
        await axios.put(`${Url}curso/${cursoEditar.id}/`, curso, {
          withCredentials: true,
        });
        recargar();
      } else {
        const curso2 = {
          ...curso,
          categoria: Number(curso.categoria),
        };
        await axios.post(`${Url}curso/`, curso2, {
          withCredentials: true,
        });
        recargar();
      }
    }
  };

  return (
    <div className="flex flex-col bg-[#c7d9f6] items-center">
      <h3 className="text-xl font-bold">Crear curso</h3>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Nombre del curso
              </label>
              <input
                type="text"
                className="h-[35px] sm:w-[215px] bg-white rounded-[10px] border-2 p-2"
                name="titulo"
                value={titulo}
                onChange={(e) => onInputChange(e)}
              />
              <p className="h-[15px] text-red-600 text-sm">{validar.titulo}</p>
            </div>
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => onInputChange(e)}
                name="categoria"
                className="h-[35px] sm:w-[215px] bg-white rounded-[10px] border-2"
              >
                <option value="0">Seleccione una categoria</option>
                {categoriaC.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <p className="h-[15px] text-red-600 text-sm">
                {validar.categoria}
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Descripción
              </label>
              <textarea
                className="h-[100px] sm:w-[450px] bg-white rounded-[10px] border-2 p-2"
                name="descripcion"
                value={descripcion}
                onChange={(e) => onInputChange(e)}
              />
              <p className="h-[15px] text-red-600 text-sm">
                {validar.descripcion}
              </p>
            </div>
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
