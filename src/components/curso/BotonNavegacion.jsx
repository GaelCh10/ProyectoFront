import React from "react";

export default function BotonNavegacion({ accion, nombre, activo }) {
  return (
    <button
      className="bg-[#3351c2] w-[150px] h-11 rounded-[20px] disabled:bg-[#72a0e8] "
      onClick={accion}
      disabled={!activo}
    >
      <span className="text-white font-bold text-2xl">{nombre}</span>
      
    </button>
  );
}
