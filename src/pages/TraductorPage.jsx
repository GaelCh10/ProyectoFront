import React from "react";
import Traductor from "../components/traductor/Traductor";

export default function TraductorPage() {
  return (
    <div className="flex flex-1 colorFondo flex-col overflow-auto ">
      <div className="flex w-full justify-center items-center self-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Traductor de voz
        </h2>
      </div>
      <div className="flex w-full justify-center">
        <Traductor />
      </div>
    </div>
  );
}
