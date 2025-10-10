import React from "react";
import { NavLink } from "react-router-dom";

export default function BotonJuego({
  ruta,
  img,
  nombre,
  instru,
  ancho,
  alto,
  divImagen,
  imgal,
}) {
  return (
    <NavLink activeclassname="active" to={ruta}>
      <div
        className={`flex items-center bg-[#0b1973] rounded-lg flex-row transition-transform 
        duration-300 hover:scale-105 ${ancho}`}
        
      >
        <div className={`flex ${divImagen} bg-white rounded-full ml-2  overflow-hidden`}>
          <img className={`w-full h-full object-cover`} src={img} alt="" />
        </div>

        <div className="flex flex-col ml-2">
          <span className="text-xl font-medium text-white 2xl:text-2xl">{nombre}</span>
        </div>
      </div>
    </NavLink>
  );
}
