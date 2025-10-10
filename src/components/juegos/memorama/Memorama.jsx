import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tablero from "./Tablero";
import axios from "axios";
import { Url } from "../../../BackUrl";
import ModalJuego from "../../Modal/ModalJuego";
import useSound from "use-sound";
import fail from "./../../../assets/Audio/fail.mp3";
import correct from "./../../../assets/Audio/correct.mp3";
import Regresar from "../../elementos/Regresar";
import finS from "./../../../assets/Audio/fin.mp3";

export default function Memorama() {
  const [memobloquesbarajados, setmemobloquesbarajados] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [selectedMemoBlock, setselectedMemoBlock] = useState(null);
  const [movimientos, setMovimientos] = useState(0);
  const [fin, setFin] = useState(false);

  const [playF] = useSound(fail);
  const [playC] = useSound(correct);
  const [playFin] = useSound(finS);

  const [mensaje, setMensaje] = useState();
  const [mns, setMns] = useState("");
  const { id } = useParams();

  useEffect(() => {
    cargarC();
  }, []);

  const cargarC = async () => {
    const resultados = await axios.get(`${Url}memorama_id/${id}/`,{
      withCredentials: true
    });
    const barajadoEmojiLista = barajarArray([...resultados.data]);
    setmemobloquesbarajados(
      barajadoEmojiLista.map((element, i) => ({
        index: i,
        ...element,
        flipped: false,
        matched: false,
      }))
    );
  };

  const barajarArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleMemoClick = (memoBlock) => {
    const MemoBlockinvertido = { ...memoBlock, flipped: true };
    let memobloquesbarajadosCopy = [...memobloquesbarajados];
    memobloquesbarajadosCopy.splice(memoBlock.index, 1, MemoBlockinvertido);

    setmemobloquesbarajados(memobloquesbarajadosCopy);

    if (selectedMemoBlock === null) {
      setMensaje("");
      setselectedMemoBlock(memoBlock);
    } else if (selectedMemoBlock.par_id === memoBlock.par_id) {
      memobloquesbarajadosCopy[memoBlock.index].matched = true;
      memobloquesbarajadosCopy[selectedMemoBlock.index].matched = true;

      setselectedMemoBlock(null);
      setMovimientos(movimientos + 1);
      setMensaje("Correcto");
      playC();
    } else {
      setAnimating(true);
      setTimeout(() => {
        memobloquesbarajadosCopy[memoBlock.index].flipped = false;
        memobloquesbarajadosCopy[selectedMemoBlock.index].flipped = false;
        setMovimientos(movimientos + 1);
        setmemobloquesbarajados(memobloquesbarajadosCopy);
        setselectedMemoBlock(null);
        setAnimating(false);
      }, 1000);
      setMensaje("Incorrecto");
      playF();
    }

    if (
      memobloquesbarajadosCopy.every(
        (element) => element.matched || element === MemoBlockinvertido
      )
    ) {
      setTimeout(() => {
        playFin();
        setMns(`Has completado el juego en ${movimientos} movimientos.`);
        setFin(true);
      }, 500);
    }
  };

  const reintentar = () => {
    setmemobloquesbarajados([]);
    cargarC();
    setMovimientos(0);
    setMensaje("");
    setFin(false);
  };
  return (
    <div className="flex flex-1 flex-col items-center overflow-auto relative space-y-3 2xl:space-y-6">
      <Regresar />
      {/* {fin && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>} */}
      <h1
        className="font-bold text-3xl text-center bg-clip-text bg-gradient-to-r text-[#1e264d] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl
      2xl:mt-3"
      >
        Memorama
      </h1>
      <p className="text-lg">Movimientos: {movimientos}</p>

      <div className="w-full flex justify-center">
        <div className="relative">
          <Tablero
            memoBlocks={memobloquesbarajados}
            handleMemoClick={handleMemoClick}
            animating={animating}
          />
          <div className="absolute top-1/2 left-full ml-6 -translate-y-1/2 w-64 text-justify">
          <h1 className="text-2xl font-bold">Instrucción:</h1>
            <p className="text-2xl">
              El objetivo del juego es encontrar todos los pares. El juego
              termina cuando todas las parejas han sido encontradas.
            </p>
          </div>
        </div>
      </div>
      <br />
      {mensaje && (
        <p
          className={`${
            mensaje === "Correcto" ? "bg-green-500" : "bg-red-500"
          } w-[100px] h-[30px] text-center rounded-2xl font-bold 2xl:w-[150px] 2xl:h-[40px] 2xl:text-3xl`}
        >
          {mensaje}
        </p>
      )}

      <ModalJuego fin={fin} mensaje={mns} setFin={setFin} accion={reintentar} />
    </div>
  );
}
