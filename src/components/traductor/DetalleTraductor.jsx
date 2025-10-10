import React from "react";

export default function DetalleTraductor({ palabra, tipo }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center h-[150px]">
        {palabra.type === "encontrada" ? (
          <img
            src={palabra.data.imagen_url}
            alt={palabra.data.imagen_url}
            className="w-[150px] h-[150px] object-contain mb-2 mt-2"
          />
        ) : (
          <p
            className={` text-black font-bold text-center bg-red-100 px-3 py-1 rounded font-lsm ${
              tipo === "Senias" ? "" : "text-3xl dactilologia2"
            } `}
          >
            {palabra.word}
          </p>
        )}
      </div>

      <p className="text-xl font-bold text-center leading-tight">
        {palabra.palabra}
      </p>
    </div>
  );
}
