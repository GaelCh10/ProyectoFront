import React from "react";
import { NavLink } from "react-router-dom";

export default function ModalJuego({
  fin,
  setFin,
  accion,
  mensaje,
  mensaje2,
  acioonB = true,
}) {
  return (
    <>
    {fin && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>}
    <div
      className={`${
        fin ? "flex" : "hidden"
      } flex-col justify-center items-center gap-7 bg-[#f2f6ff] absolute w-[300px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-lg`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="text-white w-12 h-12 bg-yellow-500 rounded-full p-2 animate-bounce"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>

      {/* <button
        className="text-white font-bold absolute right-0 top-0 mr-3 hover:text-yellow-500 text-2xl"
        onClick={() => setFin(false)}
      >
        &times;
      </button> */}

      <h1 className="text-black text-3xl font-bold tracking-wider">
        🎉 ¡Felicidades!
      </h1>

      <div className="flex justify-between gap-10">
        {/* <p className="text-white">Movimientos:</p> */}
        <p className="text-black text-center text-2xl">{mensaje}</p>
      </div>

      {mensaje2 && (
        <div className="flex justify-between gap-10">
          <p className="text-white text-center">{mensaje2}</p>
        </div>
      )}

      <div className="flex flex-row gap-4 mt-4">
        {acioonB && (
          <button
            onClick={accion}
            className="px-2 py-2 bg-[#0b1973] text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Reintentar
          </button>
        )}

        <NavLink to="/juegos">
          <button className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            Volver a Juegos
          </button>
        </NavLink>
      </div>
    </div>
    </>
  );
}
