import axios from "axios";
import React, { useEffect, useState } from "react";
import BotonJuego from "../../components/elementos/BotonJuego";
import { Url } from "../../BackUrl";
import Regresar from "../../components/elementos/Regresar";
import Cookies from "js-cookie";

export default function MemoramaPage() {
  const [memorama, setMemorama] = useState([]);
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    cargarM();
  }, []);

  const cargarM = async () => {
    setCargando(true);
    const cookies = Cookies.get("access");
    try {
      const datos = await axios.get(`${Url}memoramas/`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      });
      setMemorama(datos.data);
    } catch (error) {}
    setCargando(false);
  };

  return (
    <div className="flex flex-1 items-center flex-col relative">
      <Regresar />
      <h1 className="font-bold text-4xl text-[#1e264d] my-8 text-center  bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Memorama
      </h1>

      <div className="flex flex-col items-center space-y-4">
        {cargando && <h1>cargando...</h1>}
        {memorama.map((memoramas) => (
          <BotonJuego
            key={memoramas.id}
            img={memoramas.imagen}
            nombre={memoramas.nombre}
            ruta={`/juegos/memorama/${memoramas.id}`}
            instru={memoramas.descripcion}
            ancho="w-[400px] h-[80px]"
            divImagen={"w-[60px] h-[60px]"}
            imgal={"w-[60px]"}
          />
        ))}
      </div>
    </div>
  );
}
