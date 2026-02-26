import { useState, useEffect, useRef } from "react";
// Importamos SIGNS para poder verificar si la palabra completa es una seña
import HandModel, { SIGNS } from "../detector/ManoVirtual";

export default function PanelDePruebas() {
  const [currentSign, setCurrentSign] = useState("REPOSO"); // Inicia en reposo
  const [autoPlay, setAutoPlay] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const wordIndexRef = useRef(0);

  const alphabet = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", 
    "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", 
    "V", "W", "X", "Y", "Z"
  ];

  useEffect(() => {
    let interval;
    if (autoPlay) {
      let index = 0;
      interval = setInterval(() => {
        setCurrentSign(alphabet[index]);
        index = (index + 1) % alphabet.length;
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  useEffect(() => {
    let wordInterval;

    if (isPlayingWord && inputText.length > 0) {
      const cleanWord = inputText.toUpperCase().replace(/[^A-ZÑ]/g, '');

      if (cleanWord.length === 0) {
        setIsPlayingWord(false);
        setCurrentSign("REPOSO"); // Vuelve a reposo
        return;
      }

      const playNextLetter = () => {
        if (wordIndexRef.current >= cleanWord.length) {
          clearInterval(wordInterval);
          if (SIGNS[cleanWord]) {
            setCurrentSign(cleanWord);
            setTimeout(() => {
                setIsPlayingWord(false);
                wordIndexRef.current = 0;
                setCurrentSign("REPOSO");
            }, 2500); 

          } else {
            setIsPlayingWord(false);
            wordIndexRef.current = 0;
            setCurrentSign("REPOSO");
          }

        } else {
          const letter = cleanWord[wordIndexRef.current];
          if (alphabet.includes(letter)) {
             setCurrentSign(letter);
          }
          wordIndexRef.current++;
        }
      };

      if (wordIndexRef.current === 0) {
        playNextLetter();
      }
      wordInterval = setInterval(playNextLetter, 1300); 

    } else if (!isPlayingWord && !autoPlay) {
      wordIndexRef.current = 0;
      if (!alphabet.includes(currentSign)) {
        setCurrentSign("REPOSO");
      }
    }

    return () => clearInterval(wordInterval);
  }, [isPlayingWord, inputText, autoPlay, currentSign]);

  const handlePlayWord = () => {
    if (isPlayingWord) {
      setIsPlayingWord(false);
      wordIndexRef.current = 0;
      setCurrentSign("REPOSO");
      return;
    }
    if (autoPlay) setAutoPlay(false);
    wordIndexRef.current = 0;
    setIsPlayingWord(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-gray-100 overflow-hidden relative">
      <div className="w-full lg:w-1/3 bg-white p-6 shadow-xl  flex flex-col h-[40vh] lg:h-full overflow-hidden border-r border-gray-200">
        
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-[#fa6e06] mb-1">Mano Interactiva</h1>
          <p className="text-gray-500 text-md">
            Escribe una palabra en el traductor o selecciona una seña de abajo.
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-4 shadow-inner">
            <label className="text-xs font-bold text-orange-600 uppercase mb-2 block">
                Traductor de Texto
            </label>
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                        const rawValue = e.target.value;
                        const cleanValue = rawValue.replace(/[^a-zA-ZñÑ]/g, "").toUpperCase();
                        setInputText(cleanValue);
                        setIsPlayingWord(false); 
                    }}
                    placeholder="Escribe aquí (ej: HOLA)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-bold text-gray-700"
                    maxLength={15}
                />
                <button
                    onClick={handlePlayWord}
                    disabled={!inputText}
                    className={`px-4 rounded-lg font-bold text-white transition-all ${
                        !inputText 
                        ? "bg-gray-300 cursor-not-allowed"
                        : isPlayingWord 
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-[#fa6e06] hover:bg-orange-600"
                    }`}
                >
                    {isPlayingWord ? "⏹" : "▶"}
                </button>
            </div>
            {isPlayingWord && (
                <p className="text-xs text-orange-600 mt-2 animate-pulse">
                    Reproduciendo...
                </p>
            )}
        </div>

        <div className="bg-gray-800 p-3 rounded-lg text-center mb-4 text-white shadow-md flex justify-between items-center px-6">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Seña Actual</span>
            <span className="text-4xl font-black text-[#fa6e06]">{currentSign === "REPOSO" ? "--" : currentSign}</span>
        </div>

        <button
          onClick={() => {
              setAutoPlay(!autoPlay);
              setIsPlayingWord(false);
          }}
          className={`w-full mb-4 py-2 rounded-lg font-bold text-sm transition-all border ${
            autoPlay 
              ? "bg-red-50 border-red-200 text-red-600" 
              : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {autoPlay ? "⏹ Detener Demo Abecedario" : "▶ Demo Abecedario Completo"}
        </button>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Abecedario</h3>
          <div className="grid grid-cols-5 gap-2 pb-4">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setAutoPlay(false);
                  setIsPlayingWord(false);
                  setCurrentSign(letter);
                }}
                className={`aspect-square rounded-md font-bold text-lg shadow-sm transition-all duration-200 ${
                  currentSign === letter
                    ? "bg-[#fa6e06] text-white scale-110 ring-2 ring-orange-300"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-2/3 h-[60vh] lg:h-full relative bg-gray-200">
        <div className="absolute inset-0">
             <HandModel signToShow={currentSign} />
        </div>
      </div>
    </div>
  );
}