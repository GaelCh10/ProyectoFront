import React from "react";
import BotonJuego from "../components/elementos/BotonJuego";
import memorama from "../assets/IMG/memorama.png";
import escribe from "../assets/IMG/escribeS.png";
import crucigrama from "../assets/IMG/crucigrama.png";
import ordernar from "../assets/IMG/ordenar.png";
import buscar from "../assets/IMG/buscar.jpg";
import pares from "../assets/IMG/pares.png";
import sopa from "../assets/IMG/sopa.webp";


export default function JuegosPage() {
  const estilo = "w-[300px] h-[90px] 2xl:w-[350px] 2xl:h-[110px]"
  const estiloImg ="w-[80px] h-[80px] 2xl:w-[100px] 2xl:h-[100px]";
  return (
    <div className="flex flex-1 flex-col h-full items-center colorFondo">
      <div className="flex">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Juegos
        </h2>
      </div>

      <div className="flex w-full flex-col justify-center items-center space-y-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-5 ">
          <div className="flex flex-col space-y-2 sm:space-y-5">
            <BotonJuego
              ruta="/juegos/memorama"
              img={memorama}
              nombre="Memorama"
              ancho={estilo}
              divImagen={estiloImg}
            />
            <BotonJuego
              ruta="/juegos/escribir_sena"
              img={escribe}
              nombre="Escribe la seña"
              ancho={estilo}
              divImagen={estiloImg}
            />
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-5">
            <BotonJuego
              ruta="/juegos/crucigrama"
              img={crucigrama}
              nombre="Crucigrama"
              ancho={estilo}
              divImagen={estiloImg}
            />
            <BotonJuego
              ruta="/juegos/ordenar_palabra"
              img={ordernar}
              nombre="Ordenar Palabra"
              ancho={estilo}
              divImagen={estiloImg}
            />
            <BotonJuego
              ruta="/juegos/sopaletra"
              img={sopa}
              nombre="Sopa de letras"
              ancho={estilo}
              divImagen={estiloImg}
            />
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-5">
            <BotonJuego
              ruta="/juegos/formar_palabras"
              img={buscar}
              nombre="Forma Palabras"
              ancho={estilo}
              divImagen={estiloImg}
            />

            <BotonJuego
              ruta="/juegos/encontrar_pares"
              img={pares}
              nombre="Encontrar pares"
              ancho={estilo}
              divImagen={estiloImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
