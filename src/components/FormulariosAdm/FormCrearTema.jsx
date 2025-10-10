import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";

export default function FormCrearTema({ cancelar, cursoId, temaEditar, recargar }) {
  const [tema, setTema] = useState(
    temaEditar || {
      tipo: "",
      titulo: "",
      contenido: "",
      imagen: null,
      representativo_img: null,
      curso: cursoId,
    }
  );

  useEffect(() => {
    if (temaEditar) {
      setTema(temaEditar);
    }
  }, [temaEditar]);

  const [validar, setValidar] = useState([]);

  const { tipo, titulo, contenido } = tema;

  const onInputChange = (e) => {
    const { name, type, value, files } = e.target;

    setTema({
      ...tema,
      [name]: type === "file" ? files[0] : value,
    });

    setValidar({ ...validar, [e.target.name]: "" });
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    // Validar
    if (!titulo.trim()) {
      nuevosErrores.titulo = "El titulo es obligatorio.";
    }

    if (!tipo.trim()) {
      nuevosErrores.tipo = "Selecciona un tipo.";
    }

    if (tipo === "ep") {
      if (!tema.imagen) {
        nuevosErrores.imagen = "La imagen es obligatoria.";
      }
      if (!tema.representativo_img) {
        nuevosErrores.representativo_img =
          "La imagen representativa es obligatoria.";
      }
    } else {
      if (!contenido.trim()) {
        nuevosErrores.contenido = "Contenido obligatorio.";
      }
    }

    setValidar(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("tipo", tema.tipo);
    formData.append("titulo", tema.titulo);
    formData.append("contenido", tema.contenido);
    formData.append("curso", tema.curso);

    if (tema.imagen) {
      formData.append("imagen", tema.imagen);
    }
    if (tema.representativo_img) {
      formData.append("representativo_img", tema.representativo_img);
    }

    if (validarCampos()) {
      try {
        if (temaEditar) {
          await axios.put(`${Url}editar_tema/${temaEditar.id}/`, formData, {
            withCredentials: true,
          });
          recargar();
        } else {
          await axios.post(`${Url}nuevo_tema/`, formData, {
            withCredentials: true,
          });
          recargar();
        }
      } catch (error) {
        console.error("Error al enviar tema:", error);
      }
    }
  };
  return (
    <div className="flex flex-col sm:w-[600px] bg-[#c7d9f6] items-center">
      {temaEditar ? (
        <h3 className="text-xl font-bold">Editar Tema</h3>
      ) : (
        <h3 className="text-xl font-bold">Agregar Tema</h3>
      )}

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Titulo
              </label>
              <input
                type="text"
                className="h-[35px] bg-white rounded-[10px] border-2 sm:w-[200px]"
                name="titulo"
                value={titulo}
                onChange={(e) => onInputChange(e)}
              />
              <p className="h-[15px] text-red-600 text-sm">{validar.titulo}</p>
            </div>
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label htmlFor="">Tipo</label>
              <div className="flex flex-row space-x-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="n"
                    checked={tipo === "n"}
                    onChange={onInputChange}
                    className="mr-2"
                    disabled={temaEditar ? true : false}
                  />
                  Texto
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="ep"
                    checked={tipo === "ep"}
                    onChange={onInputChange}
                    className="mr-2"
                    disabled={temaEditar ? true : false}
                  />
                  Imagen
                </label>
              </div>
              <p className="h-[15px] text-red-600 text-sm">{validar.tipo}</p>
            </div>
          </div>
          <div className="flex flex-row">
            {tipo === "ep" ? (
              <>
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label htmlFor="imagen">Imagen de la seña</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2 px-2"
                    name="imagen"
                    onChange={(e) => onInputChange(e)}
                  />
                  <p className="h-[15px] text-red-600 text-sm">
                    {validar.imagen}
                  </p>
                </div>

                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label htmlFor="representativo_img">
                    Imagen Representativo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2 px-2"
                    name="representativo_img"
                    onChange={(e) => onInputChange(e)}
                  />
                  <p className="h-[15px] text-red-600 text-sm">
                    {validar.representativo_img}
                  </p>
                </div>
              </>
            ) : tipo === "n" ? (
              <>
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label className="" htmlFor="">
                    Contenido
                  </label>
                  <textarea
                    className="h-[100px] sm:w-[200px] bg-white rounded-[10px] border-2"
                    name="contenido"
                    value={contenido}
                    onChange={(e) => onInputChange(e)}
                  />
                  <p className="h-[15px] text-red-600 text-sm">
                    {validar.contenido}
                  </p>
                </div>
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="h-[35px] sm:w-[200px] bg-white rounded-[10px] border-2 px-2"
                    name="imagen"
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-center items-center space-x-2">
          <button
            type="submit"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-blue-700 font-bold text-white cursor-pointer hover:bg-blue-800"
          >
            {temaEditar ? "Editar" : "Registrar"}
          </button>
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-red-500 font-bold text-white cursor-pointer hover:bg-red-600"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
