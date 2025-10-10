import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Url } from "../BackUrl";
import BotonCurso from "../components/elementos/BotonCurso";
import useSound from "use-sound";
import boton1 from "../assets/Audio/boton1.mp3";
export default function CursosPage() {
  const [niveles, setNiveles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [hover, setHover] = useState(null);
  const [playB] = useSound(boton1);

  useEffect(() => {
    cargarCategoria();
    cargarNiveles();
  }, []);

  const cargarCategoria = async () => {
    try {
      const resultados = await axios.get(`${Url}categoria/1/`, {
        withCredentials: true,
      });
      setCategorias(resultados.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cargarNiveles = async () => {
    try {
      const resultados = await axios.get(`${Url}nivel/`, {
        withCredentials: true,
      });
      setNiveles(resultados.data);
    } catch (error) {
      console.log(error);
    }
  };

  const clickHover = (hoverId) => {
    if (hover == hoverId) {
      setHover(null);
    } else {
      setHover(hoverId);
    }
  };

  return (
    <div className="flex flex-1 colorFondo flex-col overflow-auto ">
      <div className="flex w-full justify-center items-center self-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Cursos
        </h2>
      </div>
      <div className="flex w-full mt-2.5 flex-col colorFondo items-center space-y-5">
        {niveles.map((nivel) => {
          const estaActivo = hover === nivel.id;
          const ocultar = hover !== null && !estaActivo;

          if (ocultar) return null;
          return nivel.id === 1 ? (
            <div
              key={nivel.id}
              className="flex items-center flex-col space-x-2"
              onClick={() => playB()}
            >
              <button
                onClick={() => clickHover(nivel.id)}
                className="flex justify-center items-center w-[300px] h-[60px]
                 bg-[#0b1973] rounded-3xl 2xl:w-[400px] 2xl:h-[80px]"
              >
                <span className="text-2xl font-medium text-amber-50 2xl:text-4xl">
                  {nivel.categoria[0].nombre}
                </span>
              </button>
              {hover === nivel.id && (
                <div className="flex items-center justify-center flex-col space-y-2 mt-[40px] text-white">
                  {nivel.categoria[0].cursos.map((cat) => (
                    <BotonCurso
                      key={cat.id}
                      nombre={cat.titulo}
                      ruta={`/cursos/curso/${cat.id}`}
                    />
                  ))}
                </div>
              )}
            </div> // div vacío cuando id es 1
          ) : (
            <div key={nivel.id} onClick={() => playB()}>
              <button
                onClick={() => clickHover(nivel.id)}
                className="flex justify-center items-center w-[300px] h-[60px] 
                bg-[#0b1973] rounded-3xl 2xl:w-[400px] 2xl:h-[80px]"
              >
                <span className="text-[25px] font-medium text-amber-50 2xl:text-4xl">
                  {nivel.nombre}
                </span>
              </button>

              {hover === nivel.id && (
                <div className="flex items-center justify-center flex-col space-y-2 mt-[40px] text-white">
                  {nivel.categoria.map((cat) => (
                    <BotonCurso
                      key={cat.id}
                      nombre={cat.nombre}
                      ruta={`/cursos/categoria/${cat.id}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
