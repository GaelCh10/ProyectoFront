import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";
import BotonJuego from "../../components/elementos/BotonJuego";
import Regresar from "../../components/elementos/Regresar";

export default function OrdenarPalabraPage() {
  const [ordenar, setOrdenar] = useState([]);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      const res = await axios.get(`${Url}juego_ordenar_palabra/`);
      setOrdenar(res.data);
    } catch (error) {}
  };

  return (
    <div className="flex flex-1 items-center flex-col relative">
      <Regresar />
      <h1 className="font-bold text-4xl text-[#1e264d] my-8 text-center  bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Ordenar Palabra
      </h1>

      <div className="flex flex-col items-center space-y-4">
        {ordenar.map((ordenar) => (
          <BotonJuego
            key={ordenar.id}
            img={ordenar.imagen}
            nombre={ordenar.nombre}
            ruta={`/juegos/ordenar_palabra/${ordenar.id}`}
            instru={ordenar.descripcion}
            ancho="w-[300px] h-[70px]"
            imgal={"w-[60px]"}
          />
        ))}
      </div>
    </div>
  );
}
