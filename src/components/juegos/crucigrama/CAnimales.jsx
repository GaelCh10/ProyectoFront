import React, { useState } from "react";
import Regresar from "../../elementos/Regresar";

export default function CAnimales() {
  const animalesGrid = [
    ["", "", "", "", "", "", "A", "", "", "", "", "", "", "C", "", "", ""],
    ["", "", "", "", "", "", "R", "", "", "", "", "", "", "A", "", "H", ""],
    ["", "", "", "", "", "", "A", "", "B", "", "", "B", "U", "R", "R", "O", ""],
    [
      "",
      "",
      "",
      "",
      "C",
      "A",
      "N",
      "G",
      "U",
      "R",
      "O",
      "",
      "",
      "A",
      "",
      "R",
      "",
    ],
    [
      "A",
      "R",
      "D",
      "I",
      "L",
      "L",
      "A",
      "",
      "H",
      "",
      "",
      "",
      "",
      "C",
      "",
      "M",
      "",
    ],
    [
      "V",
      "",
      "",
      "",
      "",
      "",
      "",
      "B",
      "O",
      "R",
      "R",
      "E",
      "G",
      "O",
      "",
      "I",
      "",
    ],
    ["E", "", "", "", "", "", "", "", "", "", "", "L", "", "L", "", "G", ""],
    ["S", "", "", "", "", "", "", "", "", "", "", "E", "", "", "", "A", ""],
    ["T", "", "", "", "", "", "", "", "", "", "", "F", "", "", "", "", ""],
    [
      "R",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "C",
      "A",
      "M",
      "A",
      "R",
      "O",
      "N",
    ],
    ["U", "", "", "", "", "", "", "", "", "", "", "N", "", "", "", "", ""],
    ["Z", "", "", "", "", "", "", "", "", "", "", "T", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "E", "", "", "", "", ""],
  ];

  const numMuebles = {
    1: [4, 0],
    2: [0, 6],
    3: [2, 8],
    4: [5, 11],
    5: [0, 13],
    6: [1, 15],
    7: [2, 11],
    8: [3, 4],
    9: [5, 7],
    10: [9, 10],
  };

  const [grid, setGrit] = useState(
    animalesGrid.map((row) => row.map(() => "")) // matriz vacio
  );
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(null); //matriz con las respuestas

  const handleInputChange = (row, col, value) => {
    const valor = value.toUpperCase();
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? valor : c))
    );
    setGrit(newGrid);
  };

  const verificarRespuestas = () => {
    const newRespuestas = grid.map((y, yIndex) =>
      y.map((x, xIndex) => {
        const isCorrecto = x === animalesGrid[yIndex][xIndex];
        return { correcto: isCorrecto };
      })
    );

    setRespuestasCorrectas(newRespuestas);
  };

  return (
    <div className="flex flex-1 h-screen justify-center flex-col items-center relative">
      <Regresar />
      <h2 className="font-bold text-3xl">Animales</h2>
      <div className="flex justify-center flex-row items-center">
        <div className="flex justify-center flex-col items-center">
          <div className="flex flex-col items-center">
            {grid.map((y, yIndex) => (
              <div key={yIndex} className="flex">
                {y.map((x, xIndex) => {
                  const numero = Object.entries(numMuebles).find(
                    ([, cordenada]) =>
                      cordenada[0] === yIndex && cordenada[1] === xIndex
                  )?.[0];
                  return (
                    <div className="relative" key={xIndex}>
                      {numero && (
                        <span className="absolute left-[3px] text-[14px] font-medium text-black">
                          {numero}
                        </span>
                      )}
                      <input
                        type="text"
                        maxLength="1"
                        value={grid[yIndex][xIndex]}
                        onChange={(e) =>
                          handleInputChange(yIndex, xIndex, e.target.value)
                        }
                        disabled={animalesGrid[yIndex][xIndex] == ""}
                        className={`w-[30px] h-[30px] text-center size-[18px] m-[2px] border-1 border-solid
                           disabled:bg-gray-300 disabled:text-black
                    ${
                      respuestasCorrectas
                        ? respuestasCorrectas[yIndex][xIndex].correcto
                          ? "bg-[lightgreen] "
                          : "bg-[lightcoral]"
                        : "bg-white"
                    }`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <button
            onClick={verificarRespuestas}
            className="p-[10px] text-base cursor-pointer mt-2 bg-blue-600 text-white border-none rounded-[5px] "
          >
            Verificar
          </button>
        </div>
        <div className="flex flex-col ml-[40px] space-y-2">
          <h2>
            Coloca cada palabra en el número del crucigrama que corresponda
          </h2>
          <h3>Vertical</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              avestruz
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">2</p>

            <p className="dactilologia2 text-2xl text-white bg-black">arana</p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">3</p>
            <p className="dactilologia2 text-2xl text-white bg-black">buho</p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">4</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              elefante
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">5</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              caracol
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">6</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              hormiga
            </p>
          </div>
          <h3>Horizontal</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              ardilla
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">7</p>
            <p className="dactilologia2 text-2xl text-white bg-black">burro</p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">8</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              canguro
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">9</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              borrego
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">10</p>
            <p className="dactilologia2 text-2xl text-white bg-black">
              camaron
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
