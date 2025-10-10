import React from "react";

export default function Comentarios({ comentario }) {
  return (
    <div className="flex w-full flex-col bg-gray-300 rounded-2xl p-2 sm:p-3 cursor-pointer ">
      <div className="">
        <h1 className="">{comentario.comentario}</h1>
      </div>

      <div className="">
        <p className="font-bold">{comentario.autor}</p>
      </div>
    </div>
  );
}
