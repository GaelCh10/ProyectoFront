import React, { useEffect, useState } from "react";
import Regresar from "../../elementos/Regresar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Url } from "../../../BackUrl";
import BlockImg from "./BlockImg";
import Tablero from "./Tablero";
import fail from "./../../../assets/Audio/fail.mp3";
import correct from "./../../../assets/Audio/correct.mp3";
import useSound from "use-sound";
import ModalJuego from "../../Modal/ModalJuego";

export default function EncontrarPares() {
  const { id } = useParams();
  const [animating, setAnimating] = useState(false);
  const [memobloquesbarajados, setmemobloquesbarajados] = useState([]);
  const [selectedMemoBlock, setselectedMemoBlock] = useState(null);
  const [movimientos, setMovimientos] = useState(0);
  const [fin, setFin] = useState(false);

  const [mensaje, setMensaje] = useState();
  const mns = "¡Lo lograste!";

  const [playF] = useSound(fail);
  const [playC] = useSound(correct);

  const [palabras, setPalabras] = useState([]);
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await axios.get(`${Url}encontrar_pares/${id}/`);
      const data = res.data;

      // Duplica cada objeto: uno como palabra, otro como imagen
      const duplicados = data.flatMap((item) => [
        {
          id: `palabra-${item.id}`,
          tipo: "palabra",
          palabra: item.palabra,
          imagen_url: item.imagen_url,
        },
        {
          id: `imagen-${item.id}`,
          tipo: "imagen",
          palabra: item.palabra,
          imagen_url: item.imagen_url,
        },
      ]);

      const barajeado = barajarArray([...duplicados]);
      setmemobloquesbarajados(
        barajeado.map((element, i) => ({
          index: i,
          ...element,
          color: "bg-white",
          flipped: false,
          matched: false,
        }))
      );
    } catch (error) {}
  };

  const barajarArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleMemoClick = (memoBlock) => {
    const MemoBlockinvertido = {
      ...memoBlock,
      flipped: true,
      color: "bg-blue-400",
    };

    let memobloquesbarajadosCopy = [...memobloquesbarajados];
    memobloquesbarajadosCopy.splice(memoBlock.index, 1, MemoBlockinvertido);

    setmemobloquesbarajados(memobloquesbarajadosCopy);

    if (selectedMemoBlock === null) {
      setMensaje("");
      setselectedMemoBlock(memoBlock);
    } else if (selectedMemoBlock.palabra === memoBlock.palabra) {
      memobloquesbarajadosCopy[memoBlock.index].matched = true;
      memobloquesbarajadosCopy[selectedMemoBlock.index].matched = true;
      memobloquesbarajadosCopy[memoBlock.index].color = "bg-green-400";
      memobloquesbarajadosCopy[selectedMemoBlock.index].color = "bg-green-400";

      setselectedMemoBlock(null);
      setMovimientos(movimientos + 1);
      playC();
    } else {
      setAnimating(true);
      memobloquesbarajadosCopy[memoBlock.index].color = "bg-red-400";
      memobloquesbarajadosCopy[selectedMemoBlock.index].color = "bg-red-400";
      setTimeout(() => {
        memobloquesbarajadosCopy[memoBlock.index].flipped = false;
        memobloquesbarajadosCopy[selectedMemoBlock.index].flipped = false;
        memobloquesbarajadosCopy[memoBlock.index].color = "bg-white";
        memobloquesbarajadosCopy[selectedMemoBlock.index].color = "bg-white";

        setmemobloquesbarajados(memobloquesbarajadosCopy);
        setselectedMemoBlock(null);
        setAnimating(false);
      }, 1000);
      playF();
    }

    if (
      memobloquesbarajadosCopy.every(
        (element) => element.matched || element === MemoBlockinvertido
      )
    ) {
      setTimeout(() => {
        setMensaje("Completas el juego");

        setFin(true);
      }, 500);
    }
  };
  const reintentar = () => {
    setmemobloquesbarajados([]);
    cargarDatos();
    setMovimientos(0);
    setFin(false);
  };
  return (
    <div className="flex flex-1 w-full items-center flex-col relative 2xl:space-y-6">
      <Regresar />
      <h1 className="font-bold text-4xl text-center text-[#1e264d] bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Encontrar pares
      </h1>
      <div className="flex space-x-2 mb-3 mt-3">
        <h1 className="font-bold text-2xl">Instrucción: </h1>
        <p className="text-2xl">Da clic para encontrar todos los pares</p>
      </div>

      <Tablero
        memoBlocks={memobloquesbarajados}
        handleMemoClick={handleMemoClick}
        animacion={animating}
      />
      <p className="mt-3 font-bold">Pares por encontrar: {movimientos}/4</p>

      <ModalJuego
        fin={fin}
        setFin={setFin}
        mensaje={mns}
        mensaje2={mensaje}
        accion={reintentar}
      />
    </div>
  );
}
