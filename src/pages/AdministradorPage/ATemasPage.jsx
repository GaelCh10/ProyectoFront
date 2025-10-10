import React, { useEffect, useState } from "react";
import Agregar from "../../components/elementos/Agregar";
import axios from "axios";
import { Url } from "../../BackUrl";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormCrearTema from "../../components/FormulariosAdm/FormCrearTema";

export default function ATemasPage() {
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalC, setModalC] = useState(false);
  const [modalE, setModalE] = useState(false);
  const { id } = useParams();
  const [temaEditando, setTemaEditando] = useState(null);

  useEffect(() => {
    cargarTemas();
  }, []);

  const cargarTemas = async () => {
    setCargando(true);
    try {
      const rest = await axios.get(`${Url}tema_curso/${id}/`, {
        withCredentials: true,
      });
      setTemas(rest.data);
      console.log(rest.data)
      setCargando(false);
    } catch (error) {}
  };

  const abrirEdicion = (tema) => {
    setTemaEditando(tema);
    setModalE(true);
  };

  const eliminar = async (idE) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este tema?"
    );
    if (!confirmar) return;

    try {
      await axios.delete(`${Url}tema/${idE}/`, { withCredentials: true });
      alert("Tema eliminado correctamente.");
      cargarTemas();
    } catch (error) {
      alert("Hubo un error al eliminar el tema.");
    }
  };
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Temas
        </h2>
      </div>
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-row w-full justify-center space-x-3">
          <Agregar nombre={"Tema"} onClick={() => setModalC(true)} />
        </div>
        <div className="flex flex-col flex-1 items-center w-full overflow-hidden">
          <h1 className="text-2xl m-3"></h1>
          {cargando ? (
            <div>Cargando...</div>
          ) : (
            <div className="flex h-[90%] w-full justify-center overflow-auto">
              <table className="table-auto min-w-[1000px] sm:w-[60%] border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left w-[20%]">
                      Título
                    </th>
                    {temas.length > 0 && temas[0].tipo === "ep" ? (
                      <>
                        <th className="border border-gray-300 px-4 py-2 w-[30%] text-left">
                          Imagen
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left w-[30%]">
                          Imagen Representativo
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="border border-gray-300 px-4 py-2 text-left w-[45%]">
                          Contenido
                        </th>
                        <th className="border border-gray-300 w-[18%] text-left">
                          Imagen
                        </th>
                      </>
                    )}

                    <th className="border border-gray-300 px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {temas.map((tema) => (
                    <tr key={tema.id} className="hover:bg-gray-50 ">
                      <td className="border border-gray-300 px-4 py-2">
                        {tema.titulo}
                      </td>
                      {tema.tipo === "ep" ? (
                        <>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <img
                              src={tema.imagen_url}
                              className="w-[100px] h-[100px] mx-auto"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <img
                              src={tema.representativo_img_url}
                              className="w-[100px] h-[100px] mx-auto"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
                            {tema.contenido}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <img
                              src={tema.imagen_url}
                              className="w-[100px] h-[100px] mx-auto"
                            />
                          </td>
                        </>
                      )}
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className=" space-x-3.5">
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            size="2xl"
                            style={{ color: "#ffc800" }}
                            onClick={() => abrirEdicion(tema)}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="2xl"
                            style={{ color: "#ff0026" }}
                            onClick={() => eliminar(tema.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Modal modal={modalC}>
        <FormCrearTema
          cursoId={id}
          cancelar={() => {
            setModalC(false);
          }}
          recargar={() => {
            cargarTemas();
          }}
        />
      </Modal>
      <Modal modal={modalE}>
        <FormCrearTema
          cursoId={id}
          cancelar={() => {
            setModalE(false);
            setTemaEditando(null);
          }}
          recargar={() => {
            setModalE(false);
            setTemaEditando(null);
            cargarTemas();
          }}
          temaEditar={temaEditando}
        />
      </Modal>
    </div>
  );
}
