import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalJuego from "../../Modal/ModalJuego";
import axios from "axios";
import { Url } from "../../../BackUrl";
import Regresar from "../../elementos/Regresar";
import fail from "./../../../assets/Audio/fail.mp3";
import correct from "./../../../assets/Audio/correct.mp3";
import useSound from "use-sound";
import finS from "./../../../assets/Audio/fin.mp3";

export default function OrdenarPalabra() {
  const [palabras, setPalabras] = useState([]);
  const [palabraA, setPalabraA] = useState(0);
  const [letrasM, setLetrasM] = useState([]);
  const [respuesta, setRespuesta] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const mns = "🎉 ¡Felicidades! terminastes el juego";
  const [fin, setFin] = useState(false);

  const { id } = useParams();
  const [playF] = useSound(fail);
  const [playC] = useSound(correct);
  const [playFin] = useSound(finS);
  useEffect(() => {
    cargarJuego();
  }, []);

  useEffect(() => {
    if (palabras.length > 0 && palabras[palabraA]) {
      setLetrasM(
        [...separarLetras[palabraA].letras].sort(() => Math.random() - 0.5)
      );
    }
  }, [palabraA, palabras]);

  const cargarJuego = async () => {
    try {
      const res = await axios.get(`${Url}ordenar_palabras/${id}/`);
      setPalabras(res.data);
    } catch (error) {
      console.error("Error cargando juego:", error);
    }
  };

  const handleLetraClick = (letra) => {
    setRespuesta((prev) => prev + letra.toLowerCase());

    setLetrasM((prev) =>
      prev
        .map((l, i) => (l === letra && i === prev.indexOf(letra) ? null : l))
        .filter(Boolean)
    );
  };

  const separarLetras = palabras.map((item) => ({
    id: item.id,
    letras: item.palabra.split(""),
  }));

  const continuar = () => {
    const palabraC = palabras[palabraA]?.palabra || "";

    if (respuesta.toLowerCase() === palabraC.toLowerCase()) {
      setMensaje("✅ ¡Correcto! La palabra es: " + palabraC);
      playC();
      if (palabraA < palabras.length - 1) {
        setTimeout(() => {
          setPalabraA(palabraA + 1);
          setMensaje("");
          setRespuesta("");
        }, 1000);
      } else {
        setTimeout(() => {
          playFin();
          setFin(true);
        }, 1000);
      }
    } else {
      setMensaje("❌ Incorrecto, intenta de nuevo.");
      playF();
      setTimeout(() => {
        setMensaje("");

        setRespuesta(""); // Reiniciar respuesta
        // Volver a mezclar las letras disponibles
        const letrasSeparadas = palabras[palabraA].palabra.split("");
        setLetrasM([...letrasSeparadas].sort(() => Math.random() - 0.5));
      }, 1000);
    }
  };

  const reintentar = () => {
    setPalabraA(0);
    setMensaje("");
    setFin(false);
    setRespuesta("");
  };
  return (
    <div className="flex flex-1 w-full items-center flex-col relative">
      <Regresar />
      <h1 className="font-bold text-4xl my-8 text-center text-[#1e264d] bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Ordenar palabra
      </h1>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Instrucción:</h1>
        <p className="text-2xl">
          Encuentra la palabra, apoyándote de las señas
        </p>
      </div>

      <div className="mb-6 mt-5">
        <input
          type="text"
          className="h-[50px] w-[350px] bg-white rounded-[10px] border-2 text-2xl text-center font-bold"
          value={respuesta}
          readOnly
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-md">
        {letrasM.map(
          (letra, index) =>
            letra && (
              <button
                key={`${letra}-${index}`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-3xl w-16 h-16 rounded-lg transition-colors shadow-md dactilologia2"
                onClick={() => handleLetraClick(letra)}
              >
                {letra}
              </button>
            )
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => {
            setRespuesta("");
            setMensaje("");
            const letrasSeparadas = palabras[palabraA].palabra.split("");
            setLetrasM([...letrasSeparadas].sort(() => Math.random() - 0.5));
          }}
          className="px-4 py-2 text-2xl bg-[#0b1973] text-white rounded-lg hover:bg-blue-900"
        >
          Reiniciar
        </button>
        <button
          onClick={continuar}
          className="px-4 py-2 w-[150px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!respuesta}
        >
          Continuar
        </button>
      </div>

      {mensaje && (
        <p
          className={`mb-4 text-xl text-center font-semibold ${
            mensaje === "❌ Incorrecto, intenta de nuevo."
              ? "text-red-700"
              : "text-green-700"
          }`}
        >
          {mensaje}
        </p>
      )}

      <ModalJuego fin={fin} mensaje={mns} accion={reintentar} />
    </div>
  );
}
