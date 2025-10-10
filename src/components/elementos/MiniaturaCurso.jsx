import React from "react";
import "./mincurso.css";
import { NavLink } from "react-router-dom";

export default function MiniaturaCurso({ img, nombreC, id }) {
  return (
    <div className="contenedorMinCurso">
      <NavLink to={`/cursos/curso/${id}`} className="navl">
        <div className="contenedorMin">
          <div className="flex bg-white w-[120px] rounded-full items-center justify-center h-[120px]">
            <img src={img} alt="" className="imgCursoMin" />
          </div>
          <h4 className="textoBlanco">{nombreC}</h4>
        </div>
      </NavLink>
    </div>
  );
}
