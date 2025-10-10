import React, { useState } from "react";
import "./c.css";
export default function Crucigrama() {
  //     const [cruc, setCruc] = useState([
  //         ['','','','','',''],
  //         ['','','','','',''],
  //         ['','','','','',''],
  //         ['','','','','',''],
  //         ['','','','','','']
  //     ])
  //   return (
  //     <div className='flex flex-col items-center mt-2.5'>
  //         {cruc.map((row, rowIndex) => (
  //         <div key={rowIndex} className="flex">
  //           {row.map((cell, colIndex) => (
  //             <input
  //               key={colIndex}
  //               type="text"
  //               maxLength="1"
  //               value={cell}
  //               onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
  //               className="w-[30px] h-[30px] text-center m-0.5 border-1"
  //             />
  //           ))}

  //         </div>
  //       ))}
  //     </div>
  //   )

  const familiaGrid = [
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", ""],
  ];

  const initialGrid = [
    ["", "", "H", "", "", "", ""],
    ["", "", "A", "", "", "", ""],
    ["", "", "M", "", "", "", ""],
    ["", "", "S", "", "", "", ""],
    ["G", "A", "T", "O", "", "", ""],
    ["", "", "E", "", "C", "", ""],
    ["P", "E", "R", "R", "O", "", ""],
    ["", "", "", "", "N", "", ""],
    ["", "", "", "", "E", "", ""],
    ["", "", "", "", "J", "", ""],
    ["", "", "", "", "O", "", ""],
  ];

  const wordStartPositions = {
    1: [4, 0], // GATO (Horizontal)
    2: [6, 0], // PERRO (Vertical)
    3: [0, 2], // HAMSTER (Vertical)
    4: [5, 4], // CONEJO (Diagonal)
  };

  const [grid, setGrid] = useState(
    initialGrid.map((row) => row.map(() => "")) // Inicializa vacío
  );
  const [g, setG] = useState(initialGrid);
  const [checkedGrid, setCheckedGrid] = useState(null); // Estado para verificar respuestas
  const [message, setMessage] = useState("");

  const handleInputChange = (row, col, value) => {
    const upperValue = value.toUpperCase();
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) =>
        rowIndex === row && colIndex === col ? upperValue : c
      )
    );
    setGrid(newGrid);
  };

  const checkAnswers = () => {
    let allCorrect = true;

    const newCheckedGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const isCorrect = cell === initialGrid[rowIndex][colIndex];
        if (!isCorrect) allCorrect = false;
        return { correct: isCorrect };
      })
    );
    console.log(newCheckedGrid);

    setCheckedGrid(newCheckedGrid);
    setMessage(
      allCorrect
        ? "¡Felicidades! Todas las respuestas son correctas. 🎉"
        : "Algunas respuestas son incorrectas. Intenta de nuevo. ❌"
    );
  };

  return (
    <div className="crossword">
      <h2>Crucigrama de Mascotas</h2>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              const number = Object.entries(wordStartPositions).find(
                ([, pos]) => pos[0] === rowIndex && pos[1] === colIndex
              )?.[0];
              return (
                <div className="cell-wrapper">
                  {number && <span className="cell-number">{number}</span>}
                  <span className="cell-number">{wordStartPositions.Object}</span>
                  <input
                    key={colIndex}
                    type="text"
                    maxLength="1"
                    value={grid[rowIndex][colIndex]}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                    disabled={g[rowIndex][colIndex] == ""}
                    className={`cell ${
                      checkedGrid
                        ? checkedGrid[rowIndex][colIndex].correct
                          ? "correct"
                          : "incorrect"
                        : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div class="input-container">
        <input className="" type="text" placeholder="" />
        <span class="corner-letter">A</span>
      </div>
      <button onClick={checkAnswers} className="check-button">
        Verificar respuestas
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
