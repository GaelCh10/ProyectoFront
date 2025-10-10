import React from "react";

export default function DetallesDic({ img, palabra }) {
  return (
    <div className="flex flex-row text-4xl justify-center items-center space-y-4 border-1 rounded-2xl border-blue-900 space-x-3">
      <img src={img} alt={palabra} className="w-[200pX]" />
      <div className="flex flex-col items-center space-y-3">
        <p className="font-bold">{palabra}</p>
        <p className="dactilologia2 font-bold">{palabra}</p>
      </div>
    </div>
  );
}
