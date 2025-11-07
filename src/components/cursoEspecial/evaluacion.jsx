import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Regresar from "../elementos/Regresar";
// import confetti from "canvas-confetti"; // Usar si lo tienes
import { obtenerPreguntasPorCursoId } from "../../data/cursosEs"; // 🚨 Usamos Mock Data

export default function EvaluacionE() {
  const { id } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [fin, setFin] = useState(false);
  const [opcionMezcladas, setOpcionMezcladas] = useState([]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null); // Almacena el ID
  const [botonActivo, setBotonActivo] = useState(false); // Deshabilita botones de opción

  useEffect(() => {
    // 🚨 Simulación de carga de preguntas
    const data = obtenerPreguntasPorCursoId(id);
    setPreguntas(data);
  }, [id]);

  useEffect(() => {
    // Mezcla las opciones al cambiar de pregunta
    if (preguntas.length > 0 && preguntas[preguntaActual]) {
      // 🚨 IMPORTANTE: Copiar el array antes de mezclar
      setOpcionMezcladas(
        [...preguntas[preguntaActual].opciones].sort(() => Math.random() - 0.5)
      );
      setRespuestaSeleccionada(null); // Limpiar la selección al cambiar de pregunta
      setBotonActivo(false); // Reactivar botones de opción
    }
  }, [preguntaActual, preguntas]);

  const verificarRespuesta = (opcion) => {
    if (botonActivo) return; // Evitar doble clic

    setRespuestaSeleccionada(opcion.id);
    setBotonActivo(true); // Deshabilita los botones de opción después de seleccionar

    if (opcion.esCorrecto) {
      setPuntuacion((p) => p + 20); // Asumiendo 5 preguntas * 20 puntos = 100
      // 🚨 Aquí podrías cambiar el color del botón seleccionado a verde
    } else {
      // 🚨 Aquí podrías cambiar el color del botón seleccionado a rojo
    }

    // Avanza a la siguiente pregunta después de un retraso
    setTimeout(() => {
      if (preguntaActual === preguntas.length - 1 || preguntas.length === 0) {
        setFin(true);
        // if (puntuacion >= 80) confetti(); // Lógica de confetti
        // 🚨 Aquí iría la llamada POST para guardar la calificación
      } else {
        setPreguntaActual(p => p + 1);
      }
    }, 1500); // Espera 1.5 segundos
  };

  const reintentar = () => {
    setPreguntaActual(0);
    setFin(false);
    setPuntuacion(0);
    setRespuestaSeleccionada(null);
  };

  // --- Renderizado Final ---
  if (fin) {
    const aprobado = puntuacion >= 40;
    return (
      <div className="flex flex-1 justify-center items-center flex-col p-5">
        <h2 className="text-3xl font-bold mb-3">{aprobado ? "🎉 ¡Felicidades!" : "😞 Evaluación Fallida"}</h2>
        <p className="text-xl">Puntuación final: {puntuacion} de {preguntas.length * 20}</p>
        <br />
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl mb-3"
          onClick={reintentar}
        >
          Reintentar Examen
        </button>
        <NavLink
          to="/cursosInternacional"
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded-xl"
        >
          Volver a Cursos Premium
        </NavLink>
      </div>
    );
  }

  // --- Renderizado Pregunta Actual ---
  const pregunta = preguntas[preguntaActual];
  if (!pregunta) {
      return <div className="flex flex-1 justify-center items-center text-xl">Cargando preguntas o no hay evaluación para este curso.</div>;
  }

  return (
    <div className="flex flex-1 items-center flex-col p-5 relative">
      <Regresar />
      <h2 className="text-4xl font-bold text-[#fa6e06] mt-4 mb-5">Evaluación Premium</h2>
      
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
        <span className="text-sm text-gray-500">
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </span>
        <p className="text-2xl font-semibold my-4">{pregunta.pregunta}</p>

        <div className="flex flex-col space-y-3">
          {opcionMezcladas.map((opcion) => (
            <button
              key={opcion.id}
              disabled={botonActivo}
              onClick={() => verificarRespuesta(opcion)}
              className={`p-3 rounded-xl border-2 text-left transition-colors
                ${botonActivo && opcion.esCorrecto ? 'bg-green-400 text-white border-green-600' : ''}
                ${botonActivo && !opcion.esCorrecto && opcion.id === respuestaSeleccionada ? 'bg-red-400 text-white border-red-600' : ''}
                ${!botonActivo ? 'bg-gray-100 hover:bg-gray-200 border-gray-300' : ''}
              `}
            >
              {opcion.respuesta}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}