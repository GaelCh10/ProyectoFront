import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Url } from "../../BackUrl";
import DetallesDic from "./DetallesDic";

export default function Busqueda() {
  const [palabra, setPalabra] = useState("");
  const [diccionario, setDiccionario] = useState({});
  const [diccionarioC, setDiccionarioC] = useState([]);

  const [modoBusqueda, setModoBusqueda] = useState("palabra");
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(0);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (modoBusqueda === "categoria") {
      cargarCategorias();
      setCategoria(0);
    }
  }, [modoBusqueda]);

  const cargarCategorias = async () => {
    try {
      const res = await axios.get(`${Url}categoria_diccionario/`, {
        withCredentials: true,
      });
      setCategorias(res.data);
    } catch (error) {}
  };

  const handleSearch = async (id) => {
    try {
      const res = await axios.post(
        `${Url}buscar/`,
        {
          palabra: palabra,
        },
        {
          withCredentials: true,
        }
      );
      setDiccionario(res.data);
      setDiccionarioC([]);
      setMensaje(res.data.mensaje);

      setTimeout(() => {
        setMensaje("");
      }, 2000);
    } catch (error) {
      setMensaje();

      console.error("Error en la búsqueda:", error);
    }
  };

  const handleSerchCategoria = async (id) => {
    try {
      const res = await axios.post(
        `${Url}buscar_categoria/`,
        {
          id: id,
        },
        {
          withCredentials: true,
        }
      );
      setDiccionarioC(res.data);
      setDiccionario({});
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  return (
    <div className="flex flex-col h-[100%] overflow-hidden">
      <div className="flex items-center p-5 space-x-2">
        <select
          value={modoBusqueda}
          onChange={(e) => {
            setModoBusqueda(e.target.value);
            setPalabra("");
          }}
          className="sm:px-3 py-2 border-2 border-[#0b1973] rounded-md outline-none sm:text-[20px]"
        >
          <option value="palabra" className="text-[10px] sm:text-[20px]">Palabra</option>
          <option value="categoria" className="text-[10px] sm:text-[20px]">Categoría</option>
        </select>

        {modoBusqueda === "palabra" ? (
          <>
            <input
              type="text"
              placeholder="Buscar palabra..."
              value={palabra}
              onChange={(e) => setPalabra(e.target.value)}
              className="w-[200px] sm:w-[400px] p-2 sm:text-2xl rounded-l-md border-2 border-[#0b1973] outline-none"
            />
          </>
        ) : (
          <select
            value={categoria}
            onChange={(e) => {
              const select = e.target.value;
              setCategoria(select);
              handleSerchCategoria(select);
            }}
            className="w-[400px] p-2 text-base rounded-l-md border border-[#0b1973] outline-none sm:text-[20px]"
          >
            <option value="0" >Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoria}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-md hover:bg-blue-700 transition cursor-pointer disabled:bg-blue-400"
          disabled={!palabra}
        >
          <FontAwesomeIcon icon={faSearch} size="2xl" />
        </button>
      </div>
      <div className="flex justify-center">
        <p className="text-red-500 font-black text-[10px] sm:text-[15px]">{mensaje}</p>
      </div>

      <div className="flex flex-col flex-1 overflow-auto space-y-4">
        {diccionario?.palabra && (
          <DetallesDic
            img={diccionario.imagen_url}
            palabra={diccionario.palabra}
          />
        )}
        {diccionarioC &&
          diccionarioC.map((categoria) => (
            <DetallesDic
              key={categoria.id}
              img={categoria.imagen_url}
              palabra={categoria.palabra}
            />
          ))}
      </div>
    </div>
  );
}
