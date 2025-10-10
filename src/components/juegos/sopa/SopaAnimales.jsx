import React, { useState } from "react";
import Regresar from "../../elementos/Regresar";
import Swal from "sweetalert2";
import ModalJuego from "../../Modal/ModalJuego";
import fail from "./../../../assets/Audio/fail.mp3";
import correct from "./../../../assets/Audio/correct.mp3";
import useSound from "use-sound";
import finS from "./../../../assets/Audio/fin.mp3";

export default function SopaAnimales() {
  const animales = [
    ["", "", "", "", "", "", "C"],
    ["O", "S", "O", "", "", "", "O"],
    ["", "", "", "", "", "", "N"],
    ["", "", "T", "I", "G", "R", "E"],
    ["", "", "", "", "", "", "J"],
    ["", "", "", "", "", "", "O"],
    ["", "L", "E", "O", "N", "", ""],
  ];
  const [playF] = useSound(fail);
  const [playC] = useSound(correct);
  const [playFin] = useSound(finS);
  const [mensaje, setMensaje] = useState("");
  const [fin, setFin] = useState(false);
  const letraAleatoria = () => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letras[Math.floor(Math.random() * letras.length)];
  };

  const [grid, setGrit] = useState(
    animales.map((row) =>
      row.map((letra) => (letra === "" ? letraAleatoria() : letra))
    )
  );

  const [selectedCells, setSelectedCells] = useState(
    Array(animales.length)
      .fill()
      .map(() => Array(animales[0].length).fill(""))
  );

  const handleClick = (yIndex, xIndex) => {
    const newSelectedCells = [...selectedCells];
    if (newSelectedCells[yIndex][xIndex] === "") {
      newSelectedCells[yIndex][xIndex] = grid[yIndex][xIndex];
    } else {
      newSelectedCells[yIndex][xIndex] = "";
    }
    setSelectedCells(newSelectedCells);
  };

  const checkSelection = () => {
    if (compararSopas(animales, selectedCells)) {
      playFin();
      setFin(true);
      setMensaje("Completaste el juego");
    } else {
      playF();
      Swal.fire({
        title: "¡Intenta de nuevo!",
        text: "Algunas respuestas son incorrectas. Sigue intentando.",
        icon: "error",
      });
    }
  };

  function compararSopas(matriz1, matriz2) {
    if (matriz1.length !== matriz2.length) return false;

    for (let y = 0; y < matriz1.length; y++) {
      if (matriz1[y].length !== matriz2[y].length) return false;

      for (let x = 0; x < matriz1[y].length; x++) {
        if (matriz1[y][x] !== matriz2[y][x]) {
          return false;
        }
      }
    }

    return true;
  }

  const reintentar = () => {
    setSelectedCells;
  };
  return (
    <div className="flex flex-1 h-full flex-col items-center relative space-y-3">
      <Regresar />
      <h2 className="font-bold text-4xl">Categoria: Animales</h2>
      <div className="text-2xl justify-center">
        <h1 className="text-2xl font-bold">Instrucción:</h1>
        <p className="text-start">Haz clic en las letras para seleccionarlas</p>
        <p className="text-start">
          Las letras seleccionadas se marcan en amarillo
        </p>
      </div>
      <div className="flex flex-row space-x-4 mt-2">
        <div className="flex justify-center flex-col items-center">
          {grid.map((y, yIndex) => (
            <div key={yIndex} className="flex">
              {y.map((x, xIndex) => (
                <input
                  key={xIndex}
                  type="text"
                  value={x}
                  className={`w-[30px] h-[30px] text-center size-[18px] m-[2px] border-1 border-solid
                           ${
                             selectedCells[yIndex][xIndex]
                               ? "bg-yellow-200"
                               : "bg-white"
                           }
                           cursor-pointer`}
                  onClick={() => handleClick(yIndex, xIndex)}
                  readOnly
                />
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">Palabras</p>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl ">
              oso
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">2.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl ">
              conejo
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">3.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl ">
              tigre
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">4.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl ">
              leon
            </p>
          </div>
        </div>
      </div>
      <p>{mensaje}</p>

      <button
        onClick={checkSelection}
        className="px-4 py-2 mt-3 w-[150px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Verificar
      </button>

      <ModalJuego fin={fin} mensaje={mensaje} accion={reintentar} />
    </div>
  );
}
