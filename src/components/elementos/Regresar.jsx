import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Regresar() {
  const navegacion = useNavigate();
  const volder = () => {
    navegacion(-1);
  };
  return (
    <button className="absolute start-3 bottom-8 bg-[#0b1973] h- rounded-2xl w-[100px] flex flex-row items-center justify-center space-x-2" onClick={volder}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        size="2xl"
        style={{ color: "#ffff" }}
      />
      <p className="text-white text-[25px]">Atrás</p>
    </button>
  );
}
