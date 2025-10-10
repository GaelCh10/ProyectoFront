import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";

export default function FormCrearEvaluacion({ cancelar, recargar }) {
  const [cursos, setcursos] = useState([]);
  const [validar, setValidar] = useState([]);

  const [evaluacion, setEvaluacion] = useState({
    titulo: "",
    descripcion: "",
    curso: "0",
  });

  const { titulo, descripcion, curso } = evaluacion;

  const onInputChange = (e) => {
    setEvaluacion({ ...evaluacion, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const rest = await axios.get(`${Url}cursos_sin_evaluacion/`, {
        withCredentials: true,
      });
      setcursos(rest.data);
    } catch (error) {
      alert("Error al cargar los cursos");
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!titulo.trim()) {
      nuevosErrores.titulo = "El nombre es obligatorio.";
    }

    if (curso === "0") {
      nuevosErrores.curso = "Seleccione un curso";
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
      try {
        await axios.post(`${Url}evaluacion/`, evaluacion, {
          withCredentials: true,
        });
        recargar();
      } catch (error) {
        alert("error al crear la evaluacion");
      }
    }
  };
  return (
    <div className="flex flex-col bg-[#c7d9f6] items-center">
      <h3 className="text-xl font-bold">Crear evaluacion</h3>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Titulo de la evaluación
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
                Curso
              </label>
              <select
                value={curso}
                onChange={(e) => onInputChange(e)}
                name="curso"
                className="h-[35px] sm:w-[215px] bg-white rounded-[10px] border-2"
              >
                <option value="0">Seleccione el curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.titulo}
                  </option>
                ))}
              </select>
              <p className="h-[15px] text-red-600 text-sm">{validar.curso}</p>
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
            Aceptar
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
