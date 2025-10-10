import axios from "axios";
import React, { useEffect, useState } from "react";

export default function PracticarPage() {
  // const [camaraActive, setCamaraActive] = useState(false);
  // const camaraActiva = () => {
  //   setCamaraActive(!camaraActive);
  // };
  // useEffect(() => {
  //   fetch("http://127.0.0.1:5000/webcam", {
  //     method: "POST",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Stream started:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error starting stream:", error);
  //     });

  //   return () => {
  //     fetch("http://127.0.0.1:5000/stop-webcam", {
  //       method: "POST",
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Stream stopped:", data);
  //       })
  //       .catch((error) => {
  //         console.error("Error stopping stream:", error);
  //       });
  //   };
  // }, []);
  // return (
  //   <div className="flex flex-1 items-center flex-col ">
  //     <h1 className="font-bold text-4xl text-center text-[#1e264d]">Detector de señas</h1>
  //     <br />
  //     <div className="flex w-[640px] h-[480px] bg-black">
  //       {camaraActiva && <img src="http://127.0.0.1:5000/webcam" alt="" />}
  //     </div>
  //     <button
  //       onClick={camaraActiva}
  //       className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
  //     >
  //       Iniciar
  //     </button>
  //   </div>
  // );
  const [camaraActive, setCamaraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCamara = () => {
    setCamaraActive(!camaraActive);
  };

  // Iniciar o detener la cámara cuando cambie el estado `camaraActive`
  useEffect(() => {
    if (camaraActive) {
      // Iniciar la cámara
      setLoading(true);
      axios
        .post("http://127.0.0.1:5000/start-webcam")
        .then((response) => {
          console.log("Stream started:", response.data);
        })
        .catch((error) => {
          console.error("Error starting stream:", error);
        });
      setTimeout(() => {
        setLoading(false);
      }, 3500);
    }

    // Función de limpieza: Detener la cámara cuando el componente se desmonte
    return () => {
      if (camaraActive) {
        axios
          .post("http://127.0.0.1:5000/stop-webcam")
          .then((response) => {
            console.log("Stream stopped:", response.data);
          })
          .catch((error) => {
            console.error("Error stopping stream:", error);
          });
      }
    };
  }, [camaraActive]);

  // Detener la cámara cuando el usuario abandone la página
  useEffect(() => {
    return () => {
      if (camaraActive) {
        axios
          .post("http://127.0.0.1:5000/stop-webcam")
          .then((response) => {
            console.log("Stream stopped (on page leave):", response.data);
          })
          .catch((error) => {
            console.error("Error stopping stream (on page leave):", error);
          });
      }
    };
  }, []); // Este efecto solo se ejecuta al desmontar el componente

  return (
    <div className="flex flex-1 items-center flex-col">
      <h1 className="font-bold text-4xl text-center text-[#1e264d]">
        Detector de señas
      </h1>
      <p>Realizar una seña a la camara para su detección</p>
      <div className="flex flex-row justify-center items-center space-x-3">
        <div className="flex w-[640px] h-[480px] bg-black">
          {loading && <p className="text-white">Cargando...</p>}
          {camaraActive && (
            <img
              src={`http://127.0.0.1:5000/webcam?${Date.now()}`}
              alt="Video stream"
              key={camaraActive ? "active" : "inactive"}
            />
          )}
        </div>
        <button
          onClick={toggleCamara}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 h-[50px]"
        >
          {camaraActive ? "Detener" : "Iniciar"}
        </button>
      </div>
    </div>
  );
}
