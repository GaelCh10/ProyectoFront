import React, { useEffect, useState } from "react";
import Foro from "../components/foro/Foro";
import Agregar from "../components/elementos/Agregar";
import Modal from "../components/Modal/Modal";
import FormAgregarForo from "../components/Formularios/FormAgregarForo";
import axios from "axios";
import { Url } from "../BackUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ForoPage() {
  const [agregar, setAgregar] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const cancelar = () => {
    setAgregar(false);
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);
  useEffect(() => {
    cargarPublicaciones();
  }, [agregar]);
  const cargarPublicaciones = async () => {
    try {
      const rest = await axios.get(`${Url}foro/`, {
        withCredentials: true,
      });
      setPublicaciones(rest.data);
    } catch (error) {}
  };
  return (
    <div className="flex flex-1 flex-col overflow-hidden items-center">
      <div className="flex w-full justify-center items-center self-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Foro
        </h2>
      </div>
      <div className="flex w-[95%] sm:w-[70%] justify-center items-center flex-col space-y-4 overflow-auto">
        <div className="flex w-[90%] justify-end">
          <button
            onClick={() => setAgregar(true)}
            className="px-4 py-2 w-[350px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            <div className="flex flex-row w-full justify-center items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div>Agregar nueva entrada</div>
            </div>
          </button>
        </div>
        <div className="flex w-full flex-col items-center space-y-4 overflow-auto">
          {publicaciones.map((publicacion) => (
            <Foro key={publicacion.id} publicacion={publicacion} />
          ))}
        </div>
      </div>
      <Modal modal={agregar}>
        <FormAgregarForo cancelar={cancelar} />
      </Modal>
    </div>
  );
}
