import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../BackUrl";
import MiniaturaCurso from "../../components/elementos/MiniaturaCurso";
import Regresar from "../../components/elementos/Regresar";
import BotonCurso from "../../components/elementos/BotonCurso";

export default function CategoriaPage() {
  const [cursos, setCursos] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const resultados = await axios.get(`${Url}curso_categoria/${id}/`, {
        withCredentials: true,
      });

      setCursos(resultados.data);
    } catch (error) {}
  };
  return (
    <div className="flex flex-1 flex-col overflow-auto relative">
      <Regresar />
      <div className="flex w-full justify-center items-center self-center ">
        {cursos[0] && (
          <h2 className="text-[#1e264d] font-bold text-4xl mt-2">
            {cursos[0].categoria_nombre}
          </h2>
        )}
      </div>
      <div className="flex w-full mt-2.5 flex-col colorFondo items-center space-y-5 text-white">
        {cursos.map((curso) => (
          <BotonCurso
            key={curso.id}
            nombre={curso.titulo}
            ruta={`/cursos/curso/${curso.id}`}
          />
        ))}
      </div>
    </div>
  );
}
