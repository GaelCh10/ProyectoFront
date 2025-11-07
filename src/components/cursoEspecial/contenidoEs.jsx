import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Regresar from "../../components/elementos/Regresar";
import BotonNavegacion from "../../components/curso/BotonNavegacion"; // Reutilizado
import { obtenerTemasPorCursoId } from "../../data/cursosEs"; // 🚨 Usamos Mock Data


// Componente simple para mostrar el tema (simula TemaDetalle)
const TemaDetalle = ({ tema }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-xl text-center">
    <h3 className="text-3xl font-bold text-gray-800 mb-3">{tema?.titulo || "Cargando Tema..."}</h3>
    <p className="text-lg text-gray-600">{tema?.contenido || ""}</p>
  </div>
);

export default function ContenidoEs() {
  const { id } = useParams();
  const [temas, setTemas] = useState([]);
  const [num, setNum] = useState(0); // Índice del tema actual

  useEffect(() => {
    // 🚨 Simulación de carga de temas
    const data = obtenerTemasPorCursoId(id);
    setTemas(data);
    setNum(0); // Reinicia al primer tema al cargar
  }, [id]);

  const siguiente = () => {
    if (num < temas.length - 1) {
      setNum(num + 1);
    }
  };

  const anterior = () => {
    if (num > 0) {
      setNum(num - 1);
    }
  };

  return (
    <div className="flex flex-1 h-full items-center flex-col relative p-5">
      <Regresar />
      <h2 className="text-3xl font-bold mb-5">Módulo: {num + 1} de {temas.length}</h2>
      
      <div className="flex w-full justify-center">
        <TemaDetalle tema={temas[num]} />
      </div>

      <div className="flex flex-row space-x-5 mt-5">
        {/* 🚨 Reutiliza BotonNavegacion (asume que existe) */}
        <BotonNavegacion nombre="Anterior" accion={anterior} activo={num > 0} />
        <BotonNavegacion nombre="Siguiente" accion={siguiente} activo={num < temas.length - 1} />
      </div>
    </div>
  );
}