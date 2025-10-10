import React, { useState } from "react";
import ModalJuego from "../../Modal/ModalJuego";
import Regresar from "../../elementos/Regresar";
import Swal from "sweetalert2";

export default function CMuebles() {
  const mueblesGrid = [
    ["", "", "", "", "", "", "", "R", "", "", "", ""],
    ["", "", "", "", "E", "S", "P", "E", "J", "O", "", ""],
    ["", "", "", "", "S", "", "", "F", "", "", "", ""],
    ["", "", "", "", "T", "", "", "R", "", "", "", ""],
    ["", "", "", "", "U", "", "S", "I", "L", "L", "O", "N"],
    ["", "", "", "", "F", "", "", "G", "", "", "", ""],
    ["S", "I", "L", "L", "A", "", "", "E", "", "", "", ""],
    ["", "", "", "", "", "", "", "R", "", "", "", ""],
    ["", "", "", "", "M", "E", "S", "A", "", "", "", ""],
    ["", "", "", "", "", "", "", "D", "", "", "", ""],
    ["", "", "", "", "", "", "", "O", "", "", "", ""],
    ["", "", "L", "A", "M", "P", "A", "R", "A", "", "", ""],
  ];

  const numMuebles = {
    1: [0, 7],
    2: [1, 4],
    3: [6, 0],
    4: [4, 6],
    5: [8, 4],
    6: [11, 2],
  };

  const [mensaje, setMensaje] = useState();
  const [fin, setFin] = useState(false);
  const [todoCorrecto, setTodoCorrecto] = useState();
  const [grid, setGrit] = useState(
    mueblesGrid.map((row) => row.map(() => "")) // matriz vacio
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
    return mueblesGrid.some((y, yIndex) =>
      y.some((x, xIndex) => x !== "" && grid[yIndex][xIndex] === "")
    );
  };

  const verificarRespuestas = () => {
    if (crucigramaCompleto()) {
      Swal.fire({
        title: "Debe de llenar todos los campos",
        icon: "error",
      });
      return;
    }

    setMensaje("¡Felicidades! Todas las respuestas son correctas.");
    setTodoCorrecto(true);
    const newRespuestas = grid.map((y, yIndex) =>
      y.map((x, xIndex) => {
        const isCorrecto = x === mueblesGrid[yIndex][xIndex];
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
    <div className="flex flex-1 h-full flex-col items-center relative overflow-hidden">
      <Regresar />
      <h2 className="font-bold text-3xl">Crucigrama: Muebles</h2>

      <div className="flex flex-1 justify-center flex-col sm:flex-row overflow-hidden">
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
                        disabled={mueblesGrid[yIndex][xIndex] == ""}
                        className={`w-[30px] h-[30px] text-center size-[18px] m-[2px] border-1 border-solid disabled:bg-gray-300 disabled:text-black disabled:border-no
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
            className="px-4 py-2 mt-3 w-[150px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Verificar
          </button>
          {todoCorrecto == false && (
            <p className="bg-red-500 rounded-[10px] font-">{mensaje}</p>
          )}
        </div>
        <div className="flex flex-col ml-[40px] space-y-2 overflow-auto">
          <h1 className="text-2xl font-bold">Instrucción: </h1>
          <h2 className="text-2xl 2xl:text-2xl">
            Coloca cada palabra en el número del crucigrama que corresponda
          </h2>
          <h3 className="font-bold">Vertical</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">1.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl ">
              refrigerador
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">2.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              estufa
            </p>
          </div>
          <h3 className="font-bold mt-2">Horizontal</h3>
          <div className="flex items-center">
            <p className="text-2xl mr-1">2.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              espejo
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">3.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              silla
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">4.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              sillon
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">5.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              mesa
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-2xl mr-1">6.</p>
            <p className="dactilologia2 text-2xl text-white bg-[#0b1973] tracking-widest 2xl:text-4xl">
              lampara
            </p>
          </div>
        </div>
      </div>
      <ModalJuego fin={fin} setFin={setFin} mensaje={mensaje} acioonB={false} />
    </div>
  );
}
