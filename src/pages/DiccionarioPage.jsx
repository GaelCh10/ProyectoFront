import React from "react";
import Diccionario from "../components/diccionario/Diccionario";

export default function DiccionarioPage() {
  return (
    <div className="flex flex-1 items-center flex-col overflow-hidden">
      <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3">
        Diccionario
      </h2>

      <Diccionario />
    </div>
  );
}
