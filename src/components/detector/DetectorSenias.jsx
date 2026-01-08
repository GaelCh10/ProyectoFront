import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

export default function DetectorSenias({ onLetraDetectada }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detectar, setDetectar] = useState(false);
  const [letra, setLetra] = useState();
  const CLASSES = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "L",
    "M",
    "N",
    "O",
    "P",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "Y",
  ];

  useEffect(() => {
    const cargarModelo = async () => {
      const model = await tf.loadGraphModel("/modelo/model.json");
      setSession(model);
      setLoading(false);
    };
    cargarModelo();
  }, []);

  useEffect(() => {
    if (!session || !detectar) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const interval = setInterval(() => {
      detectFromVideo();
    }, 200); // cada 500ms

    return () => clearInterval(interval);
  }, [session, detectar]);

  const ultimaLetraRef = useRef("");

  useEffect(() => {
    if (letra && letra !== ultimaLetraRef.current) {
      ultimaLetraRef.current = letra;
      const utterance = new SpeechSynthesisUtterance(letra);
      utterance.lang = "es-ES";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [letra]);

  const preprocesarVideo = (video) => {
    const inputSize = 640;
    return tf.tidy(() => {
      const tfImg = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(tfImg, [inputSize, inputSize]);
      const normalized = resized.div(255.0);
      return normalized.expandDims(0);
    });
  };

  const nms = (detections, iouThreshold) => {
    detections.sort((a, b) => b.confidence - a.confidence);
    const selected = [];

    while (detections.length > 0) {
      const current = detections.shift();
      selected.push(current);

      detections = detections.filter(
        (d) => calculateIoU(current.box, d.box) < iouThreshold
      );
    }

    return selected;
  };

  const postprocessOutput = (output) => {
    const detections = [];
    const data = output.dataSync();
    const numClasses = 21;
    const numBoxes = 8400;

    const classScores = new Array(numClasses);
    for (let i = 0; i < numBoxes; i++) {
      const offset = i;
      const x = data[0 * numBoxes + offset];
      const y = data[1 * numBoxes + offset];
      const w = data[2 * numBoxes + offset];
      const h = data[3 * numBoxes + offset];

      let maxProb = 0;
      let classId = 0;

      for (let j = 0; j < numClasses; j++) {
        const score = data[(4 + j) * numBoxes + offset];
        const prob = 1 / (1 + Math.exp(-score));
        classScores[j] = prob;

        if (prob > maxProb) {
          maxProb = prob;
          classId = j;
        }
      }

      if (maxProb > 0.67) {
        const scale = 1;
        const xOffset = 0;
        const yOffset = 50;
        const x1 = Math.round((x - w / 2 - xOffset) / scale);
        const y1 = Math.round((y - h / 2 - yOffset) / scale);
        const x2 = Math.round((x + w / 2 - xOffset) / scale);
        const y2 = Math.round((y + h / 2 - yOffset) / scale);

        detections.push({
          classId,
          className: CLASSES[classId],
          confidence: maxProb,
          box: [x1, y1, x2 - x1, y2 - y1],
        });
      }
    }

    return nms(detections, 0.7);
  };

  const calculateIoU = (box1, box2) => {
    const [x1, y1, w1, h1] = box1;
    const [x2, y2, w2, h2] = box2;
    const xLeft = Math.max(x1, x2);
    const yTop = Math.max(y1, y2);
    const xRight = Math.min(x1 + w1, x2 + w2);
    const yBottom = Math.min(y1 + h1, y2 + h2);

    if (xRight < xLeft || yBottom < yTop) return 0.0;
    const intersection = (xRight - xLeft) * (yBottom - yTop);
    const union = w1 * h1 + w2 * h2 - intersection;
    return intersection / union;
  };

  const drawBoundingBox = (ctx, classId, confidence, x, y, width, height) => {
    const label = `${CLASSES[classId]} ${(confidence * 100).toFixed(1)}%`;
    const color = "#06fa1c";
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.font = "30px Arial";
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x, y - 30, textWidth + 20, 30);

    ctx.fillStyle = "#000000";
    ctx.fillText(label, x + 5, y - 5);
  };

  const detectFromVideo = async () => {
    const video = videoRef.current.video;
    const canvas = canvasRef.current;

    if (!video || video.readyState !== 4 || !session) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    tf.engine().startScope();
    try {
      const preprocessInfo = preprocesarVideo(video);
      const outputs = session.predict(preprocessInfo);
      const outputTensor = Array.isArray(outputs) ? outputs[0] : outputs;
      const detections = postprocessOutput(outputTensor, preprocessInfo);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      //aqui
      //if (detections.length > 0) {
      // Tomamos la detección con más confianza
      //const best = detections[0];
      // drawBoundingBox(ctx, best.classId, best.confidence, ...best.box);

      // Actualizamos la letra detectada
      //  setLetra(best.className);
      //} else {
      // Si no detecta nada, limpiamos el estado
      //  setLetra("");
      //}
      if (detections.length > 0) {
        const best = detections[0];
        drawBoundingBox(ctx, best.classId, best.confidence, ...best.box);
        setLetra(best.className);
        if (onLetraDetectada) onLetraDetectada(best.className); // <-- notificar al padre
      } else {
        setLetra("");
        if (onLetraDetectada) onLetraDetectada("");
      }


      //hasta aqui
    } finally {
      tf.engine().endScope();
    }
  };

  return (
    <div className="flex w-full items-center flex-col">
      <h2 className="text-[#fa6e06] text-center font-bold text-6xl mt-2 letraC3 leading-9 m-0 p-0 2xl:leading-normal">
        Detector de señas con IA
      </h2>

      {loading && <p>Cargando modelo...</p>}

      <div className="flex w-full flex-col sm:flex-row items-center justify-center space-x-4 relative">
        <div className="flex">
          <div className="flex relative w-[320px] h-[240px] sm:w-[640px] sm:h-[480px]  2xl:w-[800px] 2xl:h-[600px]">
            <Webcam
              ref={videoRef}
              muted={true}
              className="w-[320px] h-[240px] sm:w-[640px] sm:h-[480px]  2xl:w-[800px] 2xl:h-[600px] absolute"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
              }}
            />

            <canvas
              ref={canvasRef}
              className="absolute w-[240px] h-[320px] sm:w-[640px] sm:h-[480px] 2xl:w-[800px] 2xl:h-[600px]"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 8,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col w-full sm:flex-col sm:w-[20%] mt-10">
          <div className="flex none sm:w-full sm:h-[200px]">
            {detectar && (
              <>
                {letra ? (
                  <div className="flex flex-1 items-center justify-center flex-col">
                    <h1 className="text-3xl font-bold">Seña detectada</h1>
                    <h1 className="text-5xl font-bold text-green-700">
                      {letra}
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-red-700"></h1>
                  </div>
                )}
              </>
            )}
          </div>
          <h1 className="font-bold text-2xl">Instrucción: </h1>
          {/* <p className="text-[18px] sm:text-2xl leading-none 2xl:leading-normal 2xl:text-2xl">
            Realiza una seña frente a la cámara para su detección a través de la
            Inteligencia Artificial
          </p> */}
          <p className="text-[18px] sm:text-[20px] leading-none 2xl:leading-normal 2xl:text-2xl">
            Coloca tu mano frente a la cámara y forma una seña estática del
            abecedario. (No reconoce señas en movimiento).
          </p>

          <button
            onClick={(e) => setDetectar(!detectar)}
            className={`px-4 mt-4 text-2xl py-2 rounded-md ${detectar ? "bg-red-500" : "bg-[#0b1973]"
              } text-white`}
          >
            {detectar ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}
