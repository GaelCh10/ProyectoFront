import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Agregar({ nombre, onClick, activo=false }) {
  return (
    <button
      onClick={onClick}
      disabled={activo}
      className="px-4 py-2 w-[150px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
    >
      <div className="flex flex-row w-full justify-center items-center space-x-2">
        <div>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div>{nombre}</div>
      </div>
    </button>
  );
}
