import React, { useEffect, useState } from "react";
import Regresar from "../../components/elementos/Regresar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Url } from "../../BackUrl";
import DetallePublicacion from "../../components/foro/DetallePublicacion";
import NuevoComentario from "../../components/foro/NuevoComentario";
import Comentarios from "../../components/foro/Comentarios";

export default function DetalleForoPage() {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState({});
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    cargarPublicacion();
    cargarComentarios();
  }, []);

  const cargarPublicacion = async () => {
    try {
      const rest = await axios.get(`${Url}foro/${id}/`, {
        withCredentials: true,
      });
      setPublicacion(rest.data);
    } catch (error) {}
  };

  const cargarComentarios = async () => {
    try {
      const rest = await axios.get(`${Url}comentarios_foro/${id}/`, {
        withCredentials: true,
      });
      setComentarios(rest.data);
    } catch (error) {}
  };
  return (
    <div className="flex flex-1 relative overflow-hidden">
      <Regresar />
      <div className="flex w-full h-full flex-col items-center overflow-auto">
        <div className="flex w-[95%] sm:w-[70%] items-center mt-4 flex-col space-y-4">
          <div className="flex w-full flex-col items-center space-y-4">
            <DetallePublicacion publicacion={publicacion} />
          </div>
          <div className="flex w-full justify-end">
            <div className="flex w-[90%] sm:w-[70%]">
              <NuevoComentario
                foroId={id}
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
      </div>
    </div>
  );
}
