import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../BackUrl";

export default function ACalificacionEstudiantes() {
  const [calificacion, setCalificacion] = useState([]);
  const {id} = useParams();

  useEffect(() => {
    cargarCalificacion();
  }, []);

  const cargarCalificacion = async () => {
    try {
      const rest = await axios.get(`${Url}obtener_calificaciones/${id}/`, {
        withCredentials: true,
      });
      setCalificacion(rest.data);
    } catch (error) {}
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Calificaciones
        </h2>
      </div>
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-col flex-1 items-center w-full overflow-hidden mb-5">
          <h1 className="text-2xl m-3"></h1>
          <div className="flex  w-full justify-center overflow-auto">
            <table className="w-[60%] border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left sm:w-[20%]">
                    Nombre
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left sm:w-[30%]">
                    Apellido Paterno
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left sm:w-[30%]">
                    Apellido Materno
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Calificacion
                  </th>
                </tr>
              </thead>
              <tbody>
                {calificacion.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 h-auto">
                    <td className="border border-gray-300 pl-2"> 
                      {c.persona.nombre}
                    </td>
                    <td className="border border-gray-300 pl-2">
                      {c.persona.apellido_p}
                    </td>
                    <td className="border border-gray-300 pl-2">
                      {c.persona.apellido_m}
                    </td>
                    <td className="border border-gray-300 pl-2">
                      {c.calificacion}
                    </td>
                  </tr>
                ))}
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
