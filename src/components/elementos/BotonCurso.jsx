import React from "react";
import { NavLink } from "react-router-dom";

export default function BotonCurso({ ruta, img, nombre, estilo }) {
  return (
    <NavLink activeclassname="active" to={ruta}>
      <div className="flex justify-center items-center w-[300px] h-[60px]
       bg-blue-700 rounded-3xl 2xl:w-[400px] 2xl:h-[75px]">
        <span className="text-[25px] font-medium 2xl:text-3xl text-center leading-none">{nombre}</span>
      </div>
    </NavLink>
  );
}
