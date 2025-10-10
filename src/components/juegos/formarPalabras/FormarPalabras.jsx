import React, { useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { Url } from "../../../BackUrl";
import axios from "axios";
import Regresar from "../../elementos/Regresar";
import fail from "./../../../assets/Audio/fail.mp3";
import correct from "./../../../assets/Audio/correct.mp3";
import useSound from "use-sound";
import finS from "./../../../assets/Audio/fin.mp3";
import ModalJuego from "../../Modal/ModalJuego";

export default function FormarPalabras() {
  const [letras, setLetras] = useState(null);
  const [palabras, setPalabras] = useState([]);
  const [numP, setNumP] = useState(3);
  const [respuesta, setRespuesta] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const mensajem = "Completaste el juego";
  const { id } = useParams();
  const [playF] = useSound(fail);
  const [playC] = useSound(correct);
  const [playFin] = useSound(finS);
  const [fin, setFin] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      const res = await axios.get(`${Url}formar_palabras/${id}/`);
      setLetras(res.data);
      setPalabras(res.data.palabras);
    } catch (error) {}
  };

  const handleLetraClick = (letra) => {
    setRespuesta((prev) => prev + letra.toLowerCase());
  };

  const verificar = () => {
    let num;
    const resp = respuesta.toLowerCase();
    const encontrada = palabras.find(
      (palabra) =>
        palabra.palabra.toLowerCase() === resp && !respuestas.includes(resp)
    );

    if (encontrada) {
      setRespuestas((prev) => [...prev, resp]);
      setNumP((prev) => prev - 1);
      num = numP;
      setMensaje("✅ ¡Correcto!");
      playC();
    } else {
      playF();
      setMensaje("❌ Incorrecto, intenta de nuevo.");
    }

    setRespuesta("");
    setTimeout(() => setMensaje(""), 2000);
    if (numP == 1) {
      playFin();
      setFin(true);
    }
  };

  const reintentar = () => {
    setRespuesta("");
    setFin(false);
    setNumP(3);
    setRespuestas([])
  };

  return (
    <div className="flex flex-1 w-full items-center flex-col relative">
      <Regresar />
      <h1 className="font-bold text-4xl my-8 text-center text-[#1e264d] bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Formar palabra
      </h1>

      <div>
        <p className="text-2xl">Palabras por encontrar: {numP}</p>
      </div>
      <div className="mb-6 mt-5">
        <input
          type="text"
          className="h-[50px] w-[350px] bg-white rounded-[10px] border-2 text-2xl text-center font-bold"
          value={respuesta}
          readOnly
        />
      </div>
      <div className="mb-4 text-xl text-center font-semibold text-gray-700">
        {mensaje}
      </div>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {letras?.letras?.split("").map((letra, index) => (
          <button
            key={`${letra}-${index}`}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-3xl w-16 h-16 rounded-lg transition-colors shadow-md dactilologia2"
            onClick={() => handleLetraClick(letra)}
          >
            {letra}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-red-500 text-2xl text-white rounded-lg hover:bg-red-700 disabled:bg-blue-300"
          onClick={() => setRespuesta("")}
        >
          Borrar
        </button>
        <button
          onClick={verificar}
          className="px-4 py-2 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!respuesta}
        >
          Verificar
        </button>
      </div>
      <div className="flex justify-center items-center text-2xl flex-col mt-5">
        <h1>Palabras encontradas</h1>
        {respuestas.map((palabra) => (
          <p>{palabra}</p>
        ))}
      </div>
      <ModalJuego
        fin={fin}
        setFin={setFin}
        mensaje={mensajem}
        accion={reintentar}
      />
    </div>
  );
}
