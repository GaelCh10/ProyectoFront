import React from "react";

export default function DetallePublicacion({ publicacion }) {
  return (
    <div className="flex w-full flex-col bg-blue-700 rounded-2xl p-2 sm:p-3 cursor-pointer text-white">
      <div className="">
        <h1 className="text-xl font-bold">{publicacion.titulo}</h1>
      </div>

      <div className="mt-3">
        <p>{publicacion.contenido}</p>
      </div>

      <div className="flex flex-row mt-3">
        <div className="flex w-[50%]">Autor: {publicacion.autor}</div>
        <div>Fecha: {publicacion.fecha}</div>
      </div>
    </div>
  );
}
