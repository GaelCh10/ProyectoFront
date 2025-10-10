import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { faMicrophoneAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Url } from "../../BackUrl";
import DetalleTraductor from "../traductor/DetalleTraductor";

export default function Traductor() {
  const [palabrasProcesadas, setPalabrasProcesadas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorVoz, setErrorVoz] = useState("");
  const [tipoTraductor, setTipoTraductor] = useState();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (
      transcript &&
      !listening &&
      !cargando &&
      palabrasProcesadas.length === 0
    ) {
      manejarBusqueda(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    setPalabrasProcesadas([]);
    resetTranscript();
  }, [tipoTraductor]);

  const onInputChange = (e) => {
    setTipoTraductor(e.target.value);
  };

  const quitarSignos = (str) => {
    return str.normalize("NFD").replace(/[.,!?;:¿¡'"\-_()\[\]{}]/g, "");
  };

  const quitarAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleTranscripcion = () => {
    resetTranscript();
    setPalabrasProcesadas([]);
    setErrorVoz("");
    if (!browserSupportsSpeechRecognition) {
      setErrorVoz("El navegador no soporta reconocimiento de voz.");
      return;
    }

    if (typeof window !== "undefined" && !window.webkitSpeechRecognition) {
      setErrorVoz("Esta funcionalidad no está disponible en tu navegador.");
      return;
    }

    SpeechRecognition.startListening({ continuous: false, language: "es-MX" });
  };

  const manejarBusqueda = async (textoABuscar) => {
    if (!textoABuscar || !textoABuscar.trim()) {
      setErrorVoz("Indique la frase a traducir para buscar palabras.");
      setPalabrasProcesadas([]);
      return;
    }

    setCargando(true);
    const palabrasTemporales = [];
    const palabrasParaBuscar = textoABuscar
      .split(" ")
      .filter((p) => p.trim() !== "");

    for (const palabra1 of palabrasParaBuscar) {
      const palabra = quitarSignos(palabra1);
      if (tipoTraductor === "Senias") {
        try {
          const res = await axios.post(
            `${Url}buscar/`,
            { palabra },
            { withCredentials: true }
          );
          if (res.data.imagen_url && Object.keys(res.data).length > 0) {
            palabrasTemporales.push({
              type: "encontrada",
              data: res.data,
              palabra: palabra1,
            });
          } else {
            palabrasTemporales.push({
              type: "noEncontrada",
              word: "Seña no disponible",
              palabra: palabra1,
            });
          }
        } catch {
          palabrasTemporales.push({
            type: "noEncontrada",
            word: "Seña no disponible",
            palabra: palabra1,
          });
        }
      } else {
        palabrasTemporales.push({
          type: "noEncontrada",
          word: quitarAcentos(palabra1),
          palabra: palabra1,
        });
      }
    }

    setPalabrasProcesadas(palabrasTemporales);
    setCargando(false);
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <p className="text-lg text-justify text-gray-700 mb-6 max-w-2xl">
        Selecciona cómo quieres ver el resultado de la traducción, Deletreo para
        que las palabras sean deletreadas, o Señas para ver el significado en
        imágenes
      </p>
      <form>
        <div className="flex flex-col p-2.5 justify-center items-center">
          <label htmlFor="">Tipo</label>
          <div className="flex flex-row space-x-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoTraductor"
                value="Senias"
                checked={tipoTraductor === "Senias"}
                onChange={onInputChange}
                className="mr-2"
              />
              Señas
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoTraductor"
                value="Deletreo"
                checked={tipoTraductor === "Deletreo"}
                onChange={onInputChange}
                className="mr-2"
              />
              Deletreo
            </label>
          </div>
        </div>
      </form>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={(e) => {
            SpeechRecognition.startListening();
            handleTranscripcion();
          }}
          disabled={!tipoTraductor}
        >
          <FontAwesomeIcon
            icon={faMicrophoneAlt}
            size="4x"
            color={listening ? "red" : "blue"}
            style={{
              opacity: !tipoTraductor ? 0.5 : 1,
            }}
          />
        </button>

        {transcript && (
          <p className="text-lg text-center text-black">
            Transcripción: {transcript}
          </p>
        )}

        {errorVoz && (
          <p className="text-red-600 text-center">Error: {errorVoz}</p>
        )}

        {cargando && <div className="mt-4">Cargando...</div>}
      </div>

      <div className="flex flex-wrap justify-center mt-8 gap-4 max-w-4xl items-center">
        {palabrasProcesadas.map((item, index) => (
          <DetalleTraductor
            key={`encontrada-${index}`}
            palabra={item}
            tipo={tipoTraductor}
          />
        ))}
      </div>
    </div>
  );
}
