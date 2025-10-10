import React from "react";

export default function TemaDetalle({ tema }) {
  if (!tema) {
    return <p>Cargando tema</p>;
  }
  return (
    <div className="flex w-full sm:ml-[70px] sm:mr-[70px]">
      {tema.tipo === "n" ? (
        <div className="flex w-full flex-col items-center">
          <div className="flex justify-center w-full text-[40px] font-bold">
            <p className="text-[#2b3b7d]">{tema.titulo}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-5">
            <div className="flex w-[80%] sm:w-[40%] text-xl">
              <p className="text-justify">{tema.contenido}</p>
            </div>
            <br />
            {tema.imagen_url && (
              <img
                src={tema.imagen_url}
                alt=""
                className="mt-2.5 w-[300px] h-auto"
              />
            )}
            {tema.video && (
              <iframe
                width="560"
                height="315"
                src={tema.video}
                frameBorder="0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      ) : tema.tipo === "ep" ? (
        <div className="flex w-full flex-col items-center justify-center sm:flex-row ">
          <div className="flex flex-col items-center w-full sm:w-auto ">
            <img
              src={tema.imagen_url}
              alt=""
              className="mt-2.5 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] 2xl:w-[400px] 2xl:h-[400px]"
            />
          </div>

          <div className="flex flex-col items-center space-y-3">
            <img
              src={tema.representativo_img_url}
              alt=""
              className="mt-2.5 w-[175px] h-[175px] sm:w-[200px] sm:h-[200px]"
            />
            <div className="flex justify-center text-[40px] font-bold bg-amber-300 p-1">
              <p className="text-[#2b3b7d]">{tema.titulo}</p>
            </div>
            <div className="flex justify-center text-[40px] font-bold bg-blue-300 p-3">
              <p className="text-[#2b3b7d] dactilologia2 text-5xl">
                {tema.titulo}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Tipo de tema no reconocido.</p>
      )}
    </div>
  );
}
