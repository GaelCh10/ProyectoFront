import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Url } from "../../BackUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faL, faX } from "@fortawesome/free-solid-svg-icons";
import confetti from "canvas-confetti";
import { AuthContext } from "../../context/AuthContext";
import Regresar from "../elementos/Regresar";

export default function Evaluacion() {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [opcionMezcladas, setOpcionMezcladas] = useState([]);
  const [botonActivo, setBotonActivo] = useState(false);
  const [continuarActivo, setContinuarActivo] = useState(true);
  const [respuesta, setRespuesta] = useState(null);
  const [botonSeleccionado, setBotonSeleccionado] = useState(null);
  const [color, setColor] = useState("");
  const [fin, setFin] = useState(false);
  const [calificacion, setCalificacion] = useState();
  const [caApro, setCaApro] = useState(false);
  const { id } = useParams();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    cargarDatos();
    cargarCalificacion();
  }, []);

  useEffect(() => {
    if (preguntas.length > 0 && preguntas[preguntaActual]) {
      setOpcionMezcladas(
        [...preguntas[preguntaActual].opcion].sort(() => Math.random() - 0.5)
      );
    }
  }, [preguntaActual, preguntas]);

  const cargarDatos = async () => {
    try {
      const rest = await axios.get(`${Url}obtener_preguntas/${id}/`, {
        withCredentials: true,
      });

      setPreguntas(rest.data);
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
    }
  };

  const cargarCalificacion = async () => {
    try {
      const rest = await axios.post(
        `${Url}obtener_calificacion/`,
        { user, id },
        {
          withCredentials: true,
        }
      );
      setCalificacion(rest.data.calificacion);
      setCaApro(rest.data.calificacion >= 80);
    } catch (error) {}
  };

  const verificarRespuesta = (esCorrecto, num, e) => {
    setContinuarActivo(false);
    setRespuesta(esCorrecto);
    setBotonSeleccionado(num);
    setColor("blue");
  };

  const guardarCalficacion = async (puntos) => {
    try {
      await axios.post(
        `${Url}guardar_calificacion/`,
        { puntos, user, id },
        {
          withCredentials: true,
        }
      );
    } catch (error) {}
  };

  const continuar = () => {
    setContinuarActivo(true);
    let puntos = puntuacion;
    if (respuesta) {
      //setColor("#22c55e");
      puntos = puntos + 20;
      setPuntuacion(puntos);
    } else {
      //setColor("#ef4444");
    }
    setBotonActivo(true);

    setTimeout(() => {
      if (preguntaActual === preguntas.length - 1) {
        guardarCalficacion(puntos);
        setFin(true);
        setBotonActivo(false);
      } else {
        setPreguntaActual(preguntaActual + 1);
        setBotonActivo(false);
      }
    }, 1000);
  };

  const reintentar = () => {
    setPreguntaActual(0);
    setFin(false);
    setPuntuacion(0);
  };

  if (fin) {
    if (puntuacion >= 80) {
      confetti();
    }
    return (
      <div className="flex flex-1 justify-center items-center flex-col colorFondo">
        {puntuacion >= 80 ? (
          <>
            <div className="flex bg-green-400 w-[50px] h-[50px] items-center justify-center rounded-full">
              <FontAwesomeIcon
                icon={faCheck}
                size="2xl"
                style={{ color: "#ffffff" }}
              />{" "}
            </div>
            <p className="text-2xl">Felicidades !</p>
            <div className="flex w-[500px] items-center justify-center flex-col">
              <div className="flex h-[200px] flex-col items-center">
                <div className="flex w-full h-[70%] flex-col mt-2 space-y-2">
                  <span>Terminaste la Evaluacion</span>
                  <span>Puntuación {puntuacion} de 100</span>
                </div>

                <div className="flex w-full flex-col justify-center items-center space-y-1">
                  <NavLink
                    to="/cursos"
                    className="bg-blue-600 rounded-2xl p-2 w-full text-center text-amber-50"
                  >
                    Cursos
                  </NavLink>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex bg-red-400 w-[50px] h-[50px] items-center justify-center rounded-full">
              <FontAwesomeIcon
                icon={faX}
                size="2xl"
                style={{ color: "#ffffff" }}
              />{" "}
            </div>
            <p className="text-2xl">Evaluación Fallida</p>
            <div className="flex w-[500px] items-center justify-center flex-col">
              <div className="flex h-[300px] flex-col items-center">
                <div className="flex w-full h-[70%] flex-col">
                  <span>Puntuacion minima: 80</span>
                  <span>Puntuación {puntuacion} de 100</span>
                </div>

                <br />
                <div className="flex w-full flex-col justify-center items-center space-y-1">
                  <button
                    className="bg-blue-400 rounded-2xl p-2 w-full"
                    onClick={(e) => reintentar()}
                  >
                    Reintentar
                  </button>
                  <NavLink
                    to="/cursos"
                    className="bg-blue-600 rounded-2xl p-2 w-full text-center text-amber-50"
                  >
                    Cursos
                  </NavLink>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center flex-col colorFondo relative">
      <Regresar />
      <div className="flex w-full justify-center">
        <h2 className="text-[#fa6e06] font-bold text-6xl mt-2 letraC3 2xl:text-8xl">
          Evaluación
        </h2>
      </div>
      {caApro ? (
        <div className="flex h-full sm:w-[500px] items-center justify-center flex-col">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Evaluación completado</h3>

            <p className="mb-4">
              {" "}
              Ya completaste esta evaluación. ¿Deseas intentarlo nuevamente?
            </p>
            <button
              onClick={() => setCaApro(false)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver a realizar el examen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full sm:w-[500px] items-center sm:justify-center flex-col">
          <div className="flex flex-col items-center">
            <span>
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
          </div>
          <br />
          {preguntas.length > 0 && preguntas[preguntaActual] ? (
            <div className="flex w-full flex-col bg-[#517fe0]">
              <div className="flex w-full flex-col sm:flex-row justify-center items-center">
                <div className="flex w-[250px] items-center justify-center flex-col">
                  <p>{preguntas[preguntaActual].pregunta}</p>
                  <img
                    src={preguntas[preguntaActual].img_pregunta_url}
                    alt=""
                    className="w-[200px] mb-2 mt-2"
                  />
                </div>
                {preguntas[preguntaActual].tipo == "texto" && (
                  <div className="flex flex-1 w-full items-center flex-col space-y-1">
                    {opcionMezcladas.map((opcion) => (
                      <button
                        disabled={botonActivo}
                        className={`flex w-[90%] sm:w-[80%] rounded-2xl p-2 border-2 border-white`}
                        style={{
                          background:
                            botonSeleccionado === opcion.id ? color : "",
                        }}
                        key={opcion.id}
                        onClick={(e) =>
                          verificarRespuesta(opcion.esCorrecto, opcion.id, e)
                        }
                      >
                        {opcion.respuesta}
                      </button>
                    ))}
                  </div>
                )}

                {preguntas[preguntaActual].tipo == "imagen" && (
                  <div className="flex flex-wrap justify-around w-[250px] h-[250px] mt-2">
                    {opcionMezcladas.map((opcion) => (
                      <button
                        disabled={botonActivo}
                        className={`flex w-[120px] h-[120px] bg-amber-50 justify-center items-center`}
                        style={{
                          background:
                            botonSeleccionado === opcion.id ? color : "",
                        }}
                        key={opcion.id}
                        onClick={(e) =>
                          verificarRespuesta(opcion.esCorrecto, opcion.id, e)
                        }
                      >
                        <img
                          src={opcion.respuesta_img_url}
                          className="w-[110px]"
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex w-full items-center justify-center mt-2">
                <button
                  className="flex rounded-2xl p-2 bg-green-500 disabled:bg-green-300"
                  disabled={continuarActivo}
                  onClick={(e) => continuar(e)}
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : (
            <div>Cargando preguntas...</div>
          )}
        </div>
      )}
    </div>
  );
}
