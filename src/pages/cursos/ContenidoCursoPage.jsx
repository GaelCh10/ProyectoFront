import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../BackUrl";
import TemaDetalle from "../../components/curso/TemaDetalle";
import BotonNavegacion from "../../components/curso/BotonNavegacion";
import Regresar from "../../components/elementos/Regresar";

export default function ContenidoCursoPage() {
  const [tema, setTema] = useState([]);
  const { id } = useParams();
  const [num, setNum] = useState(0);

  useEffect(() => {
    cargarTema();
  }, []);

  const cargarTema = async () => {
    const resultados = await axios.get(`${Url}tema_curso/${id}/`, {
      withCredentials: true,
    });
    setTema(resultados.data);
  };

  const siguiente = () => {
    if (num < tema.length - 1) {
      setNum(num + 1);
    }
  };

  const anterior = () => {
    if (num > 0) {
      setNum(num - 1);
    }
  };

  return (
    <div className="flex flex-1 h-[100%] items-center sm:justify-center flex-col relative">
      <Regresar />
      <div className="flex w-full sm:w-[80%]">
        <TemaDetalle tema={tema[num]} />
      </div>
      <br />
      <div className="flex flex-row space-x-5 mt-3">
        <BotonNavegacion nombre="Anterior" accion={anterior} activo={num>0}/>
        <BotonNavegacion nombre="Siguiente" accion={siguiente} activo={num<tema.length-1}/>
      </div>
    </div>
  );
}
