import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url } from "../../BackUrl";

export default function FormCrearPreguntas({ cancelar, id, recargar }) {
  const [imagenes, setImagenes] = useState([]);
  const [validar, setValidar] = useState({
    pregunta: "",
    tipo: "",
    img_pregunta: "",
    opciones: Array(4).fill({ respuesta: "", respuesta_img: "" }),
  });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [tipoSeleccion, setTipoSeleccion] = useState("");

  const [preguntas, setPreguntas] = useState({
    tipo: "",
    pregunta: "",
    img_pregunta: "",
    img_url: "",
    evaluacion: Number(id),
    opciones: [
      { respuesta: "", respuesta_img: "", img_url: "", esCorrecto: false },
      { respuesta: "", respuesta_img: "", img_url: "", esCorrecto: false },
      { respuesta: "", respuesta_img: "", img_url: "", esCorrecto: false },
      { respuesta: "", respuesta_img: "", img_url: "", esCorrecto: false },
    ],
  });
  const { tipo, pregunta, img_pregunta } = preguntas;

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipo") {
      if (value !== preguntas.tipo) {
        const opcionesReseteadas = preguntas.opciones.map((opcion, index) => ({
          respuesta: value === "texto" ? "" : opcion.respuesta,
          respuesta_img: value === "imagen" ? "" : opcion.respuesta_img,
          img_url: "",
          esCorrecto: false,
        }));

        setPreguntas((prev) => ({
          ...prev,
          tipo: value,
          opciones: opcionesReseteadas,
          img_pregunta: "",
          img_url: "",
        }));

        setValidar((prev) => ({
          ...prev,
          opciones: Array(4).fill({ respuesta: "", respuesta_img: "" }),
        }));
      }
    } else {
      setPreguntas((prev) => ({ ...prev, [name]: value }));
    }

    setValidar((prev) => ({ ...prev, [name]: "" }));
  };

  const actualizarOpcion = (index, campo, valor) => {
    setPreguntas((prev) => {
      const nuevasOpciones = [...prev.opciones];
      nuevasOpciones[index] = { ...nuevasOpciones[index], [campo]: valor };
      return { ...prev, opciones: nuevasOpciones };
    });
  };

  const marcarCorrecta = (index) => {
    setPreguntas((prev) => {
      const nuevasOpciones = prev.opciones.map((op, i) => ({
        ...op,
        esCorrecto: i === index,
      }));
      return { ...prev, opciones: nuevasOpciones };
    });
  };

  const seleccionarImagen = (img, tipo) => {
    if (tipo === "texto") {
      setPreguntas({ ...preguntas, img_pregunta: img.id, img_url: img.img });
      setModalAbierto(false);
    } else {
      const nuevasOpciones = [...preguntas.opciones];
      nuevasOpciones[opcionSeleccionada] = {
        ...nuevasOpciones[opcionSeleccionada],
        respuesta: "",
        respuesta_img: img.id,
        img_url: img.img,
      };
      setPreguntas({ ...preguntas, opciones: nuevasOpciones });
      setModalAbierto(false);
    }
  };

  useEffect(() => {
    cargarImagen();
  }, []);

  const cargarImagen = async () => {
    try {
      const rest = await axios.get(`${Url}imagen/`, {
        withCredentials: true,
      });
      setImagenes(rest.data);
    } catch (error) {
      alert("Erro al cargar las iamgenes");
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {
      pregunta: "",
      tipo: "",
      img_pregunta: "",
      esCorrecto: "",
      opciones: Array(4).fill({ respuesta: "", respuesta_img: "" }),
    };
    let valido = true;

    // Validar pregunta
    if (!pregunta.trim()) {
      nuevosErrores.pregunta = "La pregunta es obligatoria.";
      valido = false;
    }

    // Validar tipo
    if (!tipo.trim()) {
      nuevosErrores.tipo = "Selecciona un tipo.";
      valido = false;
    }

    // Validar imagen de pregunta si es tipo texto
    if (tipo === "texto" && !img_pregunta) {
      nuevosErrores.img_pregunta = "Selecciona una imagen para la pregunta.";
      valido = false;
    }

    // Validar opciones
    preguntas.opciones.forEach((opcion, index) => {
      if (tipo === "texto") {
        if (!opcion.respuesta.trim()) {
          nuevosErrores.opciones[index].respuesta =
            "La respuesta es obligatoria.";
          valido = false;
        }
      } else if (tipo === "imagen") {
        if (!opcion.respuesta_img) {
          nuevosErrores.opciones[index].respuesta_img =
            "Selecciona una imagen para la respuesta.";
          valido = false;
        }
      }
    });

    // Validar que haya al menos una respuesta correcta
    const hayCorrecta = preguntas.opciones.some((op) => op.esCorrecto);
    if (!hayCorrecta) {
      nuevosErrores.esCorrecto = "Selecciona un respuesta correcta.";

      valido = false;
    }

    setValidar(nuevosErrores);
    return valido;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      try {
        await axios.post(`${Url}crear_pregunta/`, preguntas, {
          withCredentials: true,
        });
        recargar();
      } catch (error) {
        alert("Error al crear la pregunta");
      }
    }
  };
  return (
    <div className="flex flex-col bg-[#c7d9f6] items-center">
      <h3 className="text-xl font-bold">Nueva pregunta</h3>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-center flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label className="" htmlFor="">
                Pregunta
              </label>
              <input
                type="text"
                className="h-[35px] bg-white rounded-[10px] border-2 sm:w-[200px]"
                name="pregunta"
                value={pregunta}
                onChange={(e) => onInputChange(e)}
              />
              <p className="h-[15px] text-red-600 text-sm">
                {validar.pregunta}
              </p>
            </div>
            <div className="flex flex-col p-2.5 justify-center items-center">
              <label htmlFor="">Tipo</label>
              <div className="flex flex-row space-x-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="texto"
                    checked={tipo === "texto"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Texto
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="imagen"
                    checked={tipo === "imagen"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Imagen
                </label>
              </div>
              <p className="h-[15px] text-red-600 text-sm">{validar.tipo}</p>
            </div>
          </div>
          <div className="flex flex-row">
            {tipo === "imagen" ? (
              <div className="flex flex-col">
                {preguntas.opciones.map((opcion, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="opcion-correcta"
                      checked={opcion.esCorrecto}
                      onChange={() => marcarCorrecta(index)}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setOpcionSeleccionada(index);
                        setTipoSeleccion("imagen");
                        setModalAbierto(true);
                      }}
                    >
                      Elegir imagen
                    </button>
                    {opcion.img_url && (
                      <span className="text-sm text-gray-500">
                        <img
                          src={opcion.img_url}
                          className="w-[40px] h-[40px]"
                        />
                      </span>
                    )}
                    <p className="h-[15px] text-red-600 text-sm">
                      {validar.opciones[index]?.respuesta_img}
                    </p>
                  </div>
                ))}
                <p className="h-[15px] text-red-600 text-sm">
                  {validar.esCorrecto}
                </p>
              </div>
            ) : tipo === "texto" ? (
              <div className="flex flex-col">
                <div className="flex flex-col p-2.5 justify-center items-center">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setTipoSeleccion("texto");
                      setModalAbierto(true);
                    }}
                  >
                    Elegir imagen
                  </button>
                  {preguntas.img_url && (
                    <img
                      src={preguntas.img_url}
                      className="w-[100px] h-[100px]"
                    />
                  )}
                  <p className="h-[15px] text-red-600 text-sm">
                    {validar.img_pregunta}
                  </p>
                </div>
                <div className="flex flex-col">
                  {preguntas.opciones.map((opcion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="opcion-correcta"
                        checked={opcion.esCorrecto}
                        onChange={() => marcarCorrecta(index)}
                      />
                      <input
                        type="text"
                        value={opcion.respuesta}
                        placeholder={`Respuesta ${index + 1}`}
                        onChange={(e) =>
                          actualizarOpcion(index, "respuesta", e.target.value)
                        }
                        className="border p-1 rounded"
                      />
                      <p className="h-[15px] text-red-600 text-sm">
                        {validar.opciones[index]?.respuesta}
                      </p>
                    </div>
                  ))}
                  <p className="h-[15px] text-red-600 text-sm">
                    {validar.esCorrecto}
                  </p>
                </div>
              </div>
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
            Registrar
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

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex w-full h-full justify-center items-center overflow-auto">
          <div className="bg-white p-4 rounded shadow-lg h-full w-[80%] overflow-auto">
            <h2 className="text-lg font-bold mb-2">Selecciona una imagen</h2>
            <div className="flex flex-wrap">
              {imagenes.map((img) => (
                <img
                  key={img.id}
                  src={img.img}
                  alt=""
                  className="w-[50px] h-[50px] cursor-pointer border hover:border-blue-500"
                  onClick={() => seleccionarImagen(img, tipoSeleccion)}
                />
              ))}
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setModalAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
