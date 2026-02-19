import { DrawingUtils, FilesetResolver, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface DetectorProps {
    onLetraDetectada?: (letra: string) => void;
}

export default function DetectorSeniasDinamicas({ onLetraDetectada }: DetectorProps) {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCounterRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [detectar, setDetectar] = useState(false);
  const [letra, setLetra] = useState("");
  
  const modelRef = useRef<tf.LayersModel | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const sequenceRef = useRef<number[][]>([]); 
  const requestRef = useRef<number | null>(null); 

  // --- NUEVAS REFERENCIAS PARA MEJORAR PRECISIÓN (SMOOTHING) ---
  const predictionHistory = useRef<string[]>([]); // Historial de últimas predicciones
  const lastEmittedLabel = useRef<string>(""); // Última letra confirmada y hablada
  // ------------------------------------------------

  // Tu lista actualizada de clases (Asegúrate de que coincida con el orden de entrenamiento)
  const CLASSES = ['Hola', 'Gracias', 'Te quiero','Aplausos','si','no']; 

  useEffect(() => {
    const cargarModelos = async () => {
      try {
        console.log("Cargando cerebro...");
        // Usamos TU ruta local
        modelRef.current = await tf.loadLayersModel("/modelodinamico/model.json");

        console.log("Cargando ojos (MediaPipe)...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        // Usamos TUS rutas locales para los tasks
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
  useEffect(() => {
    // Solo hablamos si la letra cambió REALMENTE y no está vacía
    if (letra && letra !== lastEmittedLabel.current) {
      lastEmittedLabel.current = letra;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letra);
      utterance.lang = "es-MX"; 
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [letra]);

  const extractKeypoints = (poseResult: any, handResult: any) => {
    let pose = new Array(33*4).fill(0);
    if (poseResult.landmarks && poseResult.landmarks.length > 0) {
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

    const video = videoRef.current.video;
    if (video.readyState !== 4) {
        requestRef.current = requestAnimationFrame(detectFrame);
        return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startTimeMs = performance.now();

    // Detección
    if (handLandmarkerRef.current && poseLandmarkerRef.current) {
        const handResult = handLandmarkerRef.current.detectForVideo(video, startTimeMs);
        const poseResult = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

        // Dibujar esqueletos
        const drawingUtils = new DrawingUtils(ctx);
        if(poseResult.landmarks) {
            for(const landmark of poseResult.landmarks) drawingUtils.drawLandmarks(landmark, {color: '#06fa1c', radius: 1});
        }
        if(handResult.landmarks) {
            for(const landmark of handResult.landmarks) {
                drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {color: '#fa6e06', lineWidth: 2});
                drawingUtils.drawLandmarks(landmark, {color: '#0b1973', radius: 1});
            }
        }

        // Si detecta manos, agregamos al buffer
        if (handResult.landmarks.length > 0) {
             const keypoints = extractKeypoints(poseResult, handResult);
             sequenceRef.current.push(keypoints);
        }
    }

    if (sequenceRef.current.length > 30) {
        sequenceRef.current.shift();
    }

    frameCounterRef.current++;

    // Predicción cada 3 frames
    if (sequenceRef.current.length === 30 && modelRef.current && frameCounterRef.current % 3 === 0) {
        const model = modelRef.current; 

        tf.tidy(() => {
            const input = tf.tensor([sequenceRef.current]); 
            const result = model.predict(input) as tf.Tensor;
            const data = result.dataSync(); 
            
            const maxVal = Math.max(...data);
            const maxIdx = data.indexOf(maxVal);

            // 1. Umbral de confianza
            if (maxVal > 0.80) { 
                const candidateLabel = CLASSES[maxIdx];

                // 2. Lógica de Consistencia (Smoothing)
                predictionHistory.current.push(candidateLabel);
                
                if (predictionHistory.current.length > 5) {
                    predictionHistory.current.shift();
                }

                // Verificamos si las últimas 3 predicciones son iguales para evitar parpadeos
                const last3 = predictionHistory.current.slice(-3);
                if (last3.length === 3 && last3.every(val => val === candidateLabel)) {
                    
                    if (candidateLabel !== letra) {
                        setLetra(candidateLabel);
                        if (onLetraDetectada) onLetraDetectada(candidateLabel);
                        predictionHistory.current = []; // Reiniciamos historial tras detectar
                    }
                }
            }
        });
    }

    requestRef.current = requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    if (detectar) {
        requestRef.current = requestAnimationFrame(detectFrame);
    } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setLetra(""); 
        lastEmittedLabel.current = ""; 
        sequenceRef.current = []; 
        predictionHistory.current = []; 
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [detectar]);

  return (
    <div className="flex w-full items-center flex-col min-h-screen bg-white text-white p-5">
      <h2 className="text-[#fa6e06] text-center font-bold text-4xl mb-4">
        Reconocimiento de Señas Dinámicas
      </h2>

      {loading && <p className="text-xl font-bold animate-pulse text-yellow-400">Cargando modelos de IA...</p>}

      <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-8 relative mt-4">
        
        {/* Contenedor de Video con Guía Visual */}
        <div className="relative border-4 border-[#fa6e06] rounded-xl overflow-hidden shadow-2xl bg-white w-[640px] h-[480px]">
             {/* Guía visual de posicionamiento */}
             {detectar && (
                <div className="absolute inset-0 border-2 border-dashed border-white opacity-30 z-10 pointer-events-none flex items-center justify-center">
                    <p className="text-white opacity-50 text-2xl font-bold -mt-40">Colócate aquí</p>
                </div>
             )}

            <Webcam
              ref={videoRef}
              muted={true}
              className="absolute w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }} 
            />
            <canvas
              ref={canvasRef}
              className="absolute w-full h-full object-cover z-20"
              style={{ transform: "scaleX(-1)" }} 
            />
        </div>

        {/* Panel de Control */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/3 p-6 bg-gray-800 rounded-xl shadow-lg">
          
          <div className="w-full h-40 flex items-center justify-center bg-gray-700 rounded-lg mb-6 border border-gray-600">
            {detectar ? (
              letra ? (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-gray-400 text-lg mb-2">Detectado:</span>
                  <span className="text-6xl font-extrabold text-[#06fa1c] tracking-wide">{letra}</span>
                </div>
              ) : (
                <span className="text-xl text-gray-400 italic">Esperando gesto...</span>
              )
            ) : (
              <span className="text-xl text-gray-500">Cámara apagada</span>
            )}
          </div>

          <div className="text-left w-full space-y-2 mb-6">
             <h3 className="font-bold text-xl text-[#fa6e06] mb-2">Instrucciones:</h3>
             <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Aléjate unos <strong>1.5 metros</strong> de la cámara.</li>
                <li>Asegúrate de que se vean tus <strong>codos y hombros</strong>.</li>
                <li>Haz el movimiento de forma clara y pausada.</li>
             </ul>
          </div>

          <button
            onClick={(e) => setDetectar(!detectar)}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
                loading ? "bg-gray-600 cursor-not-allowed" : 
                detectar ? "bg-red-600 hover:bg-red-700 shadow-red-500/50" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/50"
            } text-white shadow-lg`}
          >
            {loading ? "Iniciando..." : detectar ? " Detener Detección" : " Iniciar Detección"}
          </button>
        </div>
      </div>
    </div>
  );
}