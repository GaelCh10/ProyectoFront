import React, { useEffect, useState } from "react";

import TableroSenia from "../../components/juegos/escribirSenia/TableroSenia";
import { Url } from "../../BackUrl";
import BotonJuego from "../../components/elementos/BotonJuego";
import axios from "axios";
import Regresar from "../../components/elementos/Regresar";

export default function EscribirSeniaPage() {
  const [senias, setSenias] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    const resultado = await axios.get(`${Url}escribir_senias/`, {
      withCredentials: true,
    });
    setSenias(resultado.data);
  };
  return (
    <div className="flex flex-1 flex-col items-center relative">
      <Regresar />
      <h1 className="font-bold text-4xl text-[#1e264d] my-8 text-center  bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Escribe la seña
      </h1>

      <div className="flex flex-col items-center space-y-4">
        {senias.map((senia) => (
          <BotonJuego
          key={senia.id}
            nombre={senia.nombre}
            ruta={`/juegos/escribir_sena/${senia.id}`}
            ancho="w-[400px] h-[80px]"
          />
        ))}
      </div>
    </div>
  );
}
