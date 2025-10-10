import React from "react";
import BotonJuego from "../../components/elementos/BotonJuego";
import Regresar from "../../components/elementos/Regresar";

export default function CrucigramaPage() {
  return (
    <div className="flex flex-1 flex-col items-center  relative">
      <Regresar />
      <h1 className="font-bold text-4xl text-[#1e264d] my-8 text-center  bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Crucigrama
      </h1>
      <div className="flex flex-col items-center justify-center space-y-4">
        <BotonJuego
          nombre="Muebles"
          ruta={`/juegos/crucigrama/muebles`}
          ancho="w-[300px] h-[70px]"
        />
        <BotonJuego
          nombre="Familia"
          ruta={`/juegos/crucigrama/familia`}
          ancho="w-[300px] h-[70px]"
        />
        <BotonJuego
          nombre="Deportes"
          ruta={`/juegos/crucigrama/deportes`}
          ancho="w-[300px] h-[70px]"
        />
        <BotonJuego
          nombre="Animales"
          ruta={`/juegos/crucigrama/animales`}
          ancho="w-[300px] h-[70px]"
        />
      </div>
    </div>
  );
}
