import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Url } from "../../BackUrl";
import NuevoComentario from "./NuevoComentario";
import Comentarios from "./Comentarios";

export default function Foro({ publicacion }) {
  const [verMas, setVerMas] = useState(false);
  const [verComentario, setVerComentario] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    cargarComentarios();
  }, []);
  const cargarComentarios = async () => {
    try {
      const rest = await axios.get(
        `${Url}comentarios_foro/${publicacion.id}/`,
        {
          withCredentials: true,
        }
      );
      setComentarios(rest.data);
    } catch (error) {}
  };

  return (
    <>
      <div className="flex sm:w-[90%] p-2 flex-col bg-blue-700 rounded-[12px] sm:p-3 cursor-pointer text-white">
        <div className="">
          <h1 className="text-xl font-bold">{publicacion.titulo}</h1>
        </div>

        <div
          className={`mt-3 mb-3  ${
            !verMas ? "h-[50px]" : "h-auto"
          }  overflow-hidden`}
        >
          <p>{publicacion.contenido}</p>
        </div>

        <div className="flex flex-row">
          <div className="flex w-[50%]">Autor: {publicacion.autor}</div>
          <div>Fecha: {publicacion.fecha}</div>
        </div>
        <div className="flex flex-row mt-2 relative">
          <span onClick={() => setVerMas(!verMas)}>
            {verMas ? "Ver menos" : "Ver más"}
          </span>
          <span className="absolute end-4" onClick={()=>setVerComentario(!verComentario)}>Comentar</span>
        </div>
      </div>

      {verComentario && (
        <div className="flex flex-col w-full sm:w-[90%]">
          <div className="flex w-full justify-end">
            <div className="flex w-full sm:w-[70%]">
              <NuevoComentario
                foroId={publicacion.id}
                cargarComentarios={cargarComentarios}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full justify-end">
            <div className="flex w-[70%] flex-col space-y-2 mb-2">
              {comentarios.map((comentario) => (
                <Comentarios key={comentario.id} comentario={comentario} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
