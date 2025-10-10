import React, { useEffect, useState } from "react";
import Agregar from "../../components/elementos/Agregar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Url } from "../../BackUrl";
import Modal from "../../components/Modal/Modal";
import FormCrearPreguntas from "../../components/FormulariosAdm/FormCrearPreguntas";

export default function APreguntasPage() {
  const [preguntas, setPreguntas] = useState([]);
  const [modalPre, setModalPre] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = async () => {
    try {
      const rest = await axios.get(`${Url}obtener_preguntas/${id}/`, {
        withCredentials: true,
      });
      setPreguntas(rest.data);
    } catch (error) {}
  };

  const eliminarPregunta = async (idP) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta pregunta?"
    );
    if (!confirmar) return;
    try {
      await axios.delete(`${Url}pregunta/${idP}/`);
      alert("Pregunta eliminado correctamente.");
      cargarPreguntas();
    } catch (error) {
      alert("Hubo un error al eliminar la pregunta.");
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Preguntas
        </h2>
      </div>
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-row w-full justify-center space-x-3">
          <Agregar
            onClick={() => setModalPre(true)}
            nombre={"Pregunta"}
            activo={preguntas.length >= 5}
          />
        </div>
        <div className="flex flex-col flex-1 items-center w-full overflow-hidden mb-5 pt-2">
          {preguntas.length == 0 ? (
            <h1 className="text-2xl m-3">Sin preguntas</h1>
          ) : (
            <></>
          )}
          <div className="flex h-full flex-col w-full items-center overflow-auto space-y-4">


            {preguntas.map((pregunta) => (
              <div className="flex w-[50%] flex-col space-y-4">

                {pregunta.tipo === "texto" ? (
                  <div className="flex sm:w-full h-[80px] bg-blue-700 rounded-[10px] items-center p-2 space-x-3 relative">
                    <h1 className="text-white">{pregunta.pregunta}</h1>
                    <img
                      src={pregunta.img_pregunta_url}
                      className="w-[60px] h-[60px]"
                    />
                    <div className="absolute end-2 bg-black">
                      <button
                        className="bg-red-500 rounded-[7px] text-amber-50 p-1"
                        onClick={() => eliminarPregunta(pregunta.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex sm:w-full h-[40px] bg-blue-700 rounded-[10px] items-center p-2 relative">
                    <h1 className="text-white">{pregunta.pregunta}</h1>
                    <div className="absolute end-2">
                      <button
                        className="bg-red-500 rounded-[7px] text-amber-50 p-1"
                        onClick={() => eliminarPregunta(pregunta.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col">
                  {pregunta.opcion &&
                    pregunta.opcion.length > 0 &&
                    pregunta.opcion.map((opcion) => (
                      <div
                        key={opcion.id}
                        className={`flex border-3 rounded-full items-center justify-center
                        ${
                          opcion.esCorrecto
                            ? "border-green-500"
                            : "border-white"
                        }
                         ${
                           pregunta.tipo === "texto"
                             ? "w-[40px] h-[40px]"
                             : "w-[65px] h-[65px] overflow-hidden"
                         }`}
                      >
                        {" "}
                        {pregunta.tipo === "texto" ? (
                          <p>{opcion.respuesta}</p>
                        ) : (
                          <img
                            src={opcion.respuesta_img_url}
                            className="w-[60px] h-[60px]"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal modal={modalPre}>
        <FormCrearPreguntas
          cancelar={() => {
            setModalPre(false);
          }}
          id={id}
          recargar={() => {
            setModalPre(false);
            cargarPreguntas();
          }}
        />
      </Modal>
    </div>
  );
}
