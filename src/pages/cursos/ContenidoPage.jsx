import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../BackUrl";
import Regresar from "../../components/elementos/Regresar";

export default function ContenidoPage() {
  const [tema, setTema] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    cargarTema();
  }, []);

  const cargarTema = async () => {
    const resultados = await axios.get(`${Url}tema_curso/${id}/`, {
      withCredentials: true,
    });
    setTema(resultados.data);
  };
  return (
    <div className="flex items-center justify-center w-full h-full relative">
      <Regresar />
      <div className="flex flex-wrap justify-around w-[90%] space-y-2">
        {tema.map((tem) => (
          <div className="flex w-[150px] h-[150px] bg-blue-400 flex-col">
            <h1>{tem.titulo}</h1>
            <img src={tem.imagen_url} className="w-[100px]"/>
          </div>
        ))}
      </div>
    </div>
  );
}
