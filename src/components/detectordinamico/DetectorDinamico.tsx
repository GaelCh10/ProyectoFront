import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { FilesetResolver, PoseLandmarker, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

// Definimos la interfaz para las props (si la necesitas)
interface DetectorProps {
    onLetraDetectada?: (letra: string) => void;
}

export default function DetectorSeniasDinamicas({ onLetraDetectada }: DetectorProps) {
  // Usamos 'any' para evitar conflictos con la librería de Webcam y TFJS
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCounterRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [detectar, setDetectar] = useState(false);
  const [letra, setLetra] = useState("");
  
  // Aquí definimos que estas referencias pueden ser ALGO o NULL
  const modelRef = useRef<tf.LayersModel | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  
  // Especificamos que esto es un Array de Arrays de números
  const sequenceRef = useRef<number[][]>([]); 
  const requestRef = useRef<number | null>(null); 

  const CLASSES = ['Hola', 'Gracias', 'Te quiero']; 

  useEffect(() => {
    const cargarModelos = async () => {
      try {
        console.log("Cargando cerebro...");
        modelRef.current = await tf.loadLayersModel("/modelodinamico/model.json");

        console.log("Cargando ojos (MediaPipe)...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/modelodinamico/hand_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 2
        });

        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/modelodinamico/pose_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO"
        });

        setLoading(false);
        console.log("¡Todo listo!");
      } catch (error) {
        console.error("Error cargando modelos:", error);
      }
    };
    cargarModelos();
  }, []);

  // SÍNTESIS DE VOZ
  const ultimaLetraRef = useRef("");
  useEffect(() => {
    if (letra && letra !== ultimaLetraRef.current) {
      ultimaLetraRef.current = letra;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letra);
      utterance.lang = "es-MX"; 
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [letra]);

  // TIPADO EXPLICITO EN ARGUMENTOS
  const extractKeypoints = (poseResult: any, handResult: any) => {
    let pose = new Array(33*4).fill(0);
    if (poseResult.landmarks && poseResult.landmarks.length > 0) {
        // Tipamos 'lm' como any
        pose = poseResult.landmarks[0].flatMap((lm: any) => [lm.x, lm.y, lm.z, lm.visibility]);
    }

    let lh = new Array(21*3).fill(0);
    let rh = new Array(21*3).fill(0);

    if (handResult.landmarks && handResult.handedness) {
        handResult.handedness.forEach((hand: any, index: number) => {
            const label = hand[0].categoryName; 
            const landmarks = handResult.landmarks[index].flatMap((lm: any) => [lm.x, lm.y, lm.z]);
            if (label === 'Left') lh = landmarks;
            else rh = landmarks;
        });
    }
    return [...pose, ...lh, ...rh];
  };

  const detectFrame = async () => {
    if (!detectar || !videoRef.current || !videoRef.current.video) return;

    const video = videoRef.current.video; // TypeScript ya no se quejará porque videoRef es 'any'
    if (video.readyState !== 4) {
        requestRef.current = requestAnimationFrame(detectFrame);
        return;
    }

    const canvas = canvasRef.current;
    // Verificación de nulidad para canvas
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startTimeMs = performance.now();

    // Verificamos que los landmarkers existan antes de usarlos
    if (handLandmarkerRef.current && poseLandmarkerRef.current) {
        const handResult = handLandmarkerRef.current.detectForVideo(video, startTimeMs);
        const poseResult = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

        const drawingUtils = new DrawingUtils(ctx);
        if(poseResult.landmarks) {
            for(const landmark of poseResult.landmarks) drawingUtils.drawLandmarks(landmark, {color: '#06fa1c', radius: 2});
        }
        if(handResult.landmarks) {
            for(const landmark of handResult.landmarks) {
                drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {color: '#fa6e06', lineWidth: 2});
                drawingUtils.drawLandmarks(landmark, {color: '#0b1973', radius: 1});
            }
        }

        const keypoints = extractKeypoints(poseResult, handResult);
        sequenceRef.current.push(keypoints);
    }

    if (sequenceRef.current.length > 30) {
        sequenceRef.current.shift();
    }

    frameCounterRef.current ++;

// ... dentro de detectFrame ...

    // Verificamos que tengamos 30 frames y el modelo cargado
    if (sequenceRef.current.length === 30 && modelRef.current && frameCounterRef.current % 3 === 0) {
        // Capturamos el modelo en una variable local segura para TypeScript
        const model = modelRef.current; 

        tf.tidy(() => {
            const input = tf.tensor([sequenceRef.current]); 
            
            // SOLUCIÓN AQUÍ:
            // 1. Usamos 'model' en vez de 'modelRef.current' (ya verificamos que existe arriba).
            // 2. Agregamos 'as tf.Tensor' al final. Le juramos a TypeScript que el resultado es un Tensor único.
            const result = model.predict(input) as tf.Tensor;
            
            const data = result.dataSync(); 
            
            console.log("Predicción:", data); // Debug para ver si detecta algo

            const maxVal = Math.max(...data);
            const maxIdx = data.indexOf(maxVal);

            // Umbral de confianza
            if (maxVal > 0.65) { 
                const detectedLabel = CLASSES[maxIdx];
              if (detectedLabel !== letra) {
                    setLetra(detectedLabel);
                    if (onLetraDetectada) onLetraDetectada(detectedLabel);
                }
            }
        });
    }

    // ... requestAnimationFrame ...

    requestRef.current = requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    if (detectar) {
        requestRef.current = requestAnimationFrame(detectFrame);
    } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setLetra(""); 
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        sequenceRef.current = []; 
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [detectar]);

  return (
    <div className="flex w-full items-center flex-col">
      <h2 className="text-[#fa6e06] text-center font-bold text-6xl mt-2 letraC3 leading-9 m-0 p-0 2xl:leading-normal">
        Reconocimiento de Señas Dinámicas
      </h2>

      {loading && <p className="text-xl font-bold animate-pulse mt-4">Cargando modelos de IA...</p>}

      <div className="flex w-full flex-col sm:flex-row items-center justify-center space-x-4 relative mt-8">
        <div className="flex">
          <div className="flex relative w-[320px] h-[240px] sm:w-[640px] sm:h-[480px]  2xl:w-[800px] 2xl:h-[600px] border-4 border-gray-800 rounded-lg overflow-hidden bg-black">
            <Webcam
              ref={videoRef}
              muted={true}
              className="w-full h-full object-cover absolute"
              style={{ transform: "scaleX(-1)" }} 
            />

            <canvas
              ref={canvasRef}
              className="absolute w-full h-full"
              style={{ transform: "scaleX(-1)" }} 
            />
          </div>
        </div>

        <div className="flex flex-col w-full sm:flex-col sm:w-[20%] mt-10 sm:mt-0 p-4">
          <div className="flex none sm:w-full sm:h-[200px] items-center justify-center bg-gray-100 rounded-lg shadow-md mb-6">
            {detectar && (
              <>
                {letra ? (
                  <div className="flex flex-1 items-center justify-center flex-col animate-bounce">
                    <h1 className="text-xl font-bold text-gray-500">Detectado:</h1>
                    <h1 className="text-5xl font-bold text-[#06fa1c]">
                      {letra}
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold text-gray-400">Realiza un movimiento...</h1>
                  </div>
                )}
              </>
            )}
          </div>

          <h1 className="font-bold text-2xl text-[#0b1973]">Instrucciones:</h1>
          <p className="text-[18px] sm:text-[20px] leading-relaxed 2xl:text-2xl mt-2">
            1. Activa la cámara.<br/>
            2. Realiza la seña completa (movimiento).<br/>
            3. La IA necesita ver el movimiento continuo para detectarlo.
          </p>

          <button
            onClick={(e) => setDetectar(!detectar)}
            disabled={loading}
            className={`px-6 mt-6 text-2xl py-3 rounded-md font-bold transition-all shadow-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : 
                detectar ? "bg-red-500 hover:bg-red-600" : "bg-[#0b1973] hover:bg-blue-800"
            } text-white`}
          >
            {loading ? "Cargando..." : detectar ? "Desactivar Cámara" : "Activar Cámara"}
          </button>
        </div>
      </div>
    </div>
  );
}