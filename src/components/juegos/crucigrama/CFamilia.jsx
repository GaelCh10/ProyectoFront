import React, { useState } from "react";
import ModalJuego from "../../Modal/ModalJuego";
import Regresar from "../../elementos/Regresar";

export default function CFamilia() {
  const familiaGrid = [
    ["", "", "", "", "", "", "", "", "", "", "", "T", "", ""],
    ["", "", "", "", "", "M", "", "", "H", "", "", "I", "", ""],
    ["", "", "", "", "", "U", "", "", "E", "S", "P", "O", "S", "O"],
    ["", "", "", "", "", "J", "", "", "R", "", "", "", "", ""],
    ["H", "O", "M", "B", "R", "E", "", "", "M", "", "", "", "", ""],
    ["I", "", "", "", "P", "R", "I", "M", "A", "", "", "", "", ""],
    ["J", "", "", "", "", "", "", "", "N", "", "N", "", "", ""],
    ["A", "", "", "", "", "", "", "", "A", "B", "U", "E", "L", "O"],
    ["", "", "", "", "", "", "", "", "", "", "E", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "R", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "A", "", "", ""],
  ];

  const numFamilia = {
    1: [4, 0],
    2: [1, 5],
    3: [1, 8],
    4: [0, 11],
    5: [6, 10],
    6: [5, 4],
    7: [2, 8],
    8: [7, 8],
  };

  const [mensaje, setMensaje] = useState();
  const [fin, setFin] = useState(false);
  const [todoCorrecto, setTodoCorrecto] = useState();

  const [grid, setGrit] = useState(
    familiaGrid.map((row) => row.map(() => "")) // matriz vacio
  );
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(null); //matriz con las respuestas

  const handleInputChange = (row, col, value) => {
    const valor = value.toUpperCase();
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? valor : c))
    );
    setGrit(newGrid);
  };

  const crucigramaCompleto = () => {
    return familiaGrid.some((y, yIndex) =>
      y.some((x, xIndex) => x !== "" && grid[yIndex][xIndex] === "")
    );
  };

  const verificarRespuestas = () => {
    if (crucigramaCompleto()) {
      alert("Debe de llenar todos los campos");
      return;
    }

    setMensaje("¡Felicidades! Todas las respuestas son correctas.");
    setTodoCorrecto(true);

    const newRespuestas = grid.map((y, yIndex) =>
      y.map((x, xIndex) => {
        const isCorrecto = x === familiaGrid[yIndex][xIndex];
        if (!isCorrecto) {
          setTodoCorrecto(false);
          setMensaje("Algunas respuesta son incorractas");
        }
        return { correcto: isCorrecto };
      })
    );

    if (todoCorrecto) {
      setFin(true);
    }

    setRespuestasCorrectas(newRespuestas);
  };
  return (
    <div className="flex flex-1 h-full flex-col items-center relative">
      <Regresar />
      <h2 className="font-bold text-3xl">Familia</h2>
      <div className="flex justify-center flex-row items-center">
        <div className="flex justify-center flex-col items-center">
          <div className="flex flex-col items-center">
            {grid.map((y, yIndex) => (
              <div key={yIndex} className="flex">
                {y.map((x, xIndex) => {
                  const numero = Object.entries(numFamilia).find(
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
                        disabled={familiaGrid[yIndex][xIndex] == ""}
                        className={`w-[30px] h-[30px] text-center size-[18px] m-[2px] border-1 border-solid disabled:bg-gray-300 disabled:text-black
                          2xl:w-[50px] 2xl:h-[50px] 2xl:text-3xl
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
            className="p-[10px] text-base cursor-pointer mt-2 bg-blue-600 text-white border-none rounded-[5px]
            2xl:text-2xl  "
          >
            Verificar
          </button>
          <br />
          {todoCorrecto == false && (
            <p className="bg-red-500 rounded-[10px] font-">{mensaje}</p>
          )}
        </div>
        <div className="flex flex-col ml-[40px] space-y-2">
          <h2>
            Coloca cada palabra en el número del crucigrama que corresponda
          </h2>
          <h3>Vertical</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              hija
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">2</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              mujer
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">3</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              hermana
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">4</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              tio
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">5</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              nuera
            </p>
          </div>
          <h3>Horizontal</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              hombre
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">6</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              prima
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">7</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              esposo
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">8</p>
            <p className="dactilologia2 text-2xl text-white bg-black 2xl:text-4xl">
              abuelo
            </p>
          </div>
        </div>
      </div>
      <ModalJuego fin={fin} setFin={setFin} mensaje={mensaje} acioonB={false} />
    </div>
  );
}
