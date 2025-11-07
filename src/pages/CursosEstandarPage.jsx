import React, { useState, useEffect } from "react";
import BotonCurso from "../components/elementos/BotonCurso"; // Reutilizado
import { Link } from "react-router-dom";
import { cursosEspecialesMock } from "../data/cursosEs"; // 🚨 Usamos Mock Data

export default function CursosEstandarPage() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 🚨 Simulación de carga asíncrona (reemplazando axios)
    setTimeout(() => {
      setCursos(cursosEspecialesMock);
      setCargando(false);
    }, 500); // 500ms de retraso para simular API
  }, []);

  if (cargando) {
    return <div className="flex flex-1 justify-center items-center text-blue-500 text-3xl">Cargando Cursos Premium...</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto items-center p-5">
      <h2 className="text-5xl font-extrabold text-[#fa6e06] mt-4 mb-8">
        🌟 Cursos Premium
      </h2>
      <div className="flex w-full mt-2.5 flex-wrap justify-center gap-6">
        {cursos.map((curso) => (
          <BotonCurso
            key={curso.id}
            nombre={curso.titulo}
            // 🚨 RUTA NUEVA: Apunta al detalle del curso en esta sección
            ruta={`/cursosInternacional/curso/${curso.id}`}
          />
        ))}
      </div>
    </div>
  );
}