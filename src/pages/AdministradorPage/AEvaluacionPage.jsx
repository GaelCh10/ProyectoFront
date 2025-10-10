import React, { useEffect, useState } from "react";
import Agregar from "../../components/elementos/Agregar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Url } from "../../BackUrl";
import Modal from "../../components/Modal/Modal";
import FormCrearEvaluacion from "../../components/FormulariosAdm/FormCrearEvaluacion";

export default function AEvaluacionPage() {
  const [evaluacion, setEvaluacion] = useState([]);
  const [modalEva, setModalEva] = useState(false);

  useEffect(() => {
    cargarEvaluacion();
  }, []);

  const cargarEvaluacion = async () => {
    try {
      const rest = await axios.get(`${Url}evaluacion/`, {
        withCredentials: true,
      });
      setEvaluacion(rest.data);
    } catch (error) {}
  };

  const abrirEdicion = () => {
    setModalEva(true);
  };
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Evaluacion
        </h2>
      </div>
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-row w-full justify-center space-x-3">
          <Agregar onClick={() => setModalEva(true)} nombre={"Evaluacion"} />
        </div>
        <div className="flex flex-col flex-1 items-center w-full overflow-hidden mb-5">
          <h1 className="text-2xl m-3"></h1>
          <div className="flex h-full w-full justify-center overflow-auto">
            <table className="table-auto w-[60%] border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left sm:w-[20%]">
                    Título
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left sm:w-[40%]">
                    Descripción
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Curso
                  </th>
                  <td className="border border-gray-300 "></td>
                  <td className="border border-gray-300 "></td>
                </tr>
              </thead>
              <tbody>
                {evaluacion.map((evaluacion) => (
                  <tr key={evaluacion.id} className="hover:bg-gray-50 ">
                    <td className="border border-gray-300 px-4 py-2">
                      {evaluacion.titulo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
                      {evaluacion.descripcion}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {evaluacion.curso_titulo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex flex-col space-y-2">
                        <NavLink to={`/admin/evaluacion/${evaluacion.id}`}>
                          <div className="bg-blue-500 rounded-[10px] text-center text-amber-50 p-2">
                            Preguntas
                          </div>
                        </NavLink>
                        <NavLink to={`/admin/evaluacion/calificacion/${evaluacion.id}`}>
                          <div className="bg-blue-700 rounded-[10px] text-center text-amber-50 p-2">
                            Calificación estudiantes
                          </div>
                        </NavLink>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="2xl"
                        style={{ color: "#ffc800" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal modal={modalEva}>
        <FormCrearEvaluacion
          cancelar={() => {
            setModalEva(false);
          }}
          recargar={() => {
            cargarEvaluacion();
            setModalEva(false);
          }}
        />
      </Modal>
    </div>
  );
}
