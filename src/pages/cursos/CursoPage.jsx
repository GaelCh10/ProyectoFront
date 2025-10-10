import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Regresar from "../../components/elementos/Regresar";

export default function CursoPage() {
  const { id } = useParams();
  const [curso, setCurso] = useState({});

  useEffect(() => {
    cargarCurso();
  }, []);

  const cargarCurso = async () => {
    const dato = await axios.get(`${Url}curso/${id}/`, {
      withCredentials: true,
    });
    setCurso(dato.data);
  };

  return (
    <div className="flex flex-1 flex-col items-center relative">
      <Regresar />
      <div className="flex w-[80%] items-center justify-center mt-10 bg-[#2b3b7d] rounded-[10px] border-white border-[1px] relative">
        <h2 className="text-4xl font-bold text-white">{curso.titulo}</h2>
      </div>
      <div className="flex flex-col w-[80%] sm:flex-row justify-center items-center">
        <div className="flex flex-col w-full items-center justify-center sm:w-[80%] bg-white mt-5 rounded-[10px] border-[#1e264d] border-[1px] p-0.5 sm:flex-row sm:items-stretch sm:space-x-10">
          <div className="flex flex-col w-[90%] sm:w-[90%]">
            <h2 className="text-[25px] font-bold text-[#2b3b7d]">
              Descripción
            </h2>
            <p className="text-justify text-[20px]">{curso.descripcion}</p>
          </div>

          
        </div>
        <div className="flex flex-col w-full justify-center items-center sm:w-[50%] bg-white mt-5 rounded-[10px] border-[#1e264d]  p-0.5 space-y-2">
          <NavLink
            className="flex w-[80%] h-13 justify-center items-center bg-[#1e264d] rounded-2xl mt-3 sm:w-[70%]"
            to={`/cursos/curso/tema/${id}`}
          >
            <p className="text-white font-bold text-2xl">Iniciar Curso</p>
          </NavLink>
          <NavLink
            className="flex w-[80%] h-13 justify-center items-center bg-[#1e264d] rounded-2xl mb-3 sm:w-[70%]"
            to={`/cursos/curso/evaluacion/${id}`}
          >
            <p className="text-white font-bold text-2xl">Evaluación</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
