import React, { useEffect, useState } from "react";
import Regresar from "../../components/elementos/Regresar";
import BotonJuego from "../../components/elementos/BotonJuego";
import axios from "axios";
import { Url } from "../../BackUrl";

export default function EncontrarParesPage() {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      const res = await axios.get(`${Url}juego_encontrar_pares/`);

      setJuegos(res.data);
    } catch (error) {}
  };
  return (
    <div className="flex flex-1 items-center flex-col relative">
      <Regresar />
      <h1 className="font-bold text-4xl text-[#1e264d] my-8 text-center  bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Encontrar pares
      </h1>

      <div className="flex flex-col items-center space-y-4">
        {juegos.map((juego) => (
          <BotonJuego
            key={juego.id}
            img={juego.imagen}
            nombre={juego.nombre}
            ruta={`/juegos/encontrar_pares/${juego.id}`}
            instru={juego.descripcion}
             ancho="w-[300px] h-[70px]"
            imgal={"w-[60px]"}
          />
        ))}
      </div>
    </div>
  );
}
