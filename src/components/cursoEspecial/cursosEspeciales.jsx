import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Regresar from "../../components/elementos/Regresar"; // Reutilizado
import { obtenerCursoPorId } from "../../data/cursosEs"; // 🚨 Usamos Mock Data

export default function CursosEspeciales() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    // 🚨 Simulación de carga del detalle del curso
    const data = obtenerCursoPorId(id);
    setCurso(data);
  }, [id]);

  if (!curso) {
    return <div className="flex flex-1 justify-center items-center text-red-500 text-xl">Curso no encontrado.</div>;
  }

  return (
    <div className="flex flex-1 flex-col items-center relative p-5">
      <Regresar />
      <div className="flex w-[80%] items-center justify-center mt-10 bg-[#2b3b7d] rounded-[10px] p-4">
        <h2 className="text-4xl font-bold text-white">{curso.titulo}</h2>
      </div>
      
      <div className="w-[80%] my-5 p-5 bg-white rounded-lg shadow-lg">
        <h3 className="text-[25px] font-bold text-[#2b3b7d] mb-3">Descripción</h3>
        <p className="text-justify text-[20px]">{curso.descripcion}</p>
      </div>

      <div className="flex flex-col w-[80%] sm:w-[50%] justify-center items-center space-y-3">
        {/* 🚨 RUTA NUEVA: Iniciar Curso */}
        <NavLink
          className="w-full h-13 justify-center items-center bg-green-600 rounded-2xl p-3 text-center"
          to={`/cursosInternacional/curso/tema/${id}`}
        >
          <p className="text-white font-bold text-2xl">Empezar a Aprender</p>
        </NavLink>
        
        {/* 🚨 RUTA NUEVA: Evaluación */}
        <NavLink
          className="w-full h-13 justify-center items-center bg-red-500 rounded-2xl p-3 text-center"
          to={`/cursosInternacional/curso/evaluacion/${id}`}
        >
          <p className="text-white font-bold text-2xl">Realizar Evaluación</p>
        </NavLink>
      </div>
    </div>
  );
}