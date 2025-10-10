import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Url } from "../../BackUrl";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function NuevoComentario({ foroId, cargarComentarios }) {
  const [validar, setValidar] = useState([]);
  const { user } = useContext(AuthContext);

  const [comentarioT, setComentarioT] = useState({
    comentario: "",
    usuario: user,
    foro: foroId,
  });
  const { comentario, usuario, foro } = comentarioT;

  const onInputChange = (e) => {
    setComentarioT({ ...comentarioT, [e.target.name]: e.target.value });
    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    // Validar
    if (!comentario.trim()) {
      nuevosErrores.comentario = "El comentario es obligatorio.";
    }

    setValidar(nuevosErrores); 
    return Object.keys(nuevosErrores).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
              console.log(comentarioT);

      try {
        await axios.post(`${Url}nuevo_comentario/`, comentarioT, {
          withCredentials: true,
        });
        setComentarioT({
          comentario: "",
          usuario: user,
          foro: foroId.id,
        });
        cargarComentarios();
      } catch (error) {
        console.error("Error al enviar comentario:", error);
      }
    }
  };
  return (
    <div className="flex w-full">
      <form onSubmit={(e) => onSubmit(e)} className="w-full">
        <div className="flex flex-row items-center">
          <div className="flex w-[80%] flex-col sm:pl-5 sm:pr-5 items-start">
            <textarea
              className="w-full h-[50px] bg-white rounded-[10px] border-2 p-2 resize-none"
              name="comentario"
              placeholder="Comentar"
              value={comentario}
              onChange={onInputChange}
            />
            <p className="h-[15px] text-red-600 text-sm">
              {validar.comentario}
            </p>
          </div>
          <button
            type="submit"
            className="w-[20%] sm:w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-blue-500 hover:bg-blue-700 font-bold text-white cursor-pointer"
          >
            <FontAwesomeIcon icon={faPaperPlane} size="xl"/>
          </button>
        </div>
      </form>
    </div>
  );
}
