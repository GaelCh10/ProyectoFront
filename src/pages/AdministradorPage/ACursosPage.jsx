import React, { useEffect, useState } from "react";
import Agregar from "../../components/elementos/Agregar";
import axios from "axios";
import { Url } from "../../BackUrl";
import Modal from "../../components/Modal/Modal";
import FormCrearCategoria from "../../components/FormulariosAdm/FormCrearCategoria";
import { NavLink } from "react-router-dom";
import FormCrearCurso from "../../components/FormulariosAdm/FormCrearCurso";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function ACursosPage() {
  const [cursos, setCursos] = useState([]);
  const [modalC, setModalC] = useState(false);
  const [modalCu, setModalCu] = useState(false);
  const [cursoEditar, setCursoEditar] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const rest = await axios.get(`${Url}curso/`, {
        withCredentials: true,
      });
      setCursos(rest.data);
    } catch (error) {}
  };

  const abrirEdicion = (curso) => {
    setModalCu(true);
    setCursoEditar(curso);
  };
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Cursos
        </h2>
      </div>
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-row w-full justify-center space-x-3">
          <Agregar onClick={() => setModalC(true)} nombre={"Categoria"} />
          <Agregar onClick={() => setModalCu(true)} nombre={"Curso"} />
        </div>
        <div className="flex flex-col flex-1 items-center w-full overflow-hidden mb-5">
          <h1 className="text-2xl m-3">Cursos disponibles</h1>
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
                    Categoría
                  </th>
                  <td className="border border-gray-300 "></td>
                  <td className="border border-gray-300 "></td>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-gray-50 ">
                    <td className="border border-gray-300 px-4 py-2">
                      {curso.titulo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
                      {curso.descripcion}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {curso.categoria_nombre}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <NavLink to={`/admin/cursos/${curso.id}`}>
                        <div className="bg-blue-500 rounded-[10px] w-[60px] text-center text-amber-50">
                          Temas
                        </div>
                      </NavLink>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="2xl"
                        style={{ color: "#ffc800" }}
                        onClick={() => abrirEdicion(curso)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal modal={modalC}>
        <FormCrearCategoria cancelar={() => setModalC(false)} />
      </Modal>
      <Modal modal={modalCu}>
        <FormCrearCurso
          cancelar={() => {
            setModalCu(false);
            setCursoEditar(null);
          }}
          recargar={() => {
            cargarCursos();
            setModalCu(false);
          }}
          cursoEditar={cursoEditar}
        />
      </Modal>
    </div>
  );
}
