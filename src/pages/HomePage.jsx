import React from "react";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center flex-col relative">
      <div className="flex items-center flex-col sm:w-[80%] mt-2">
        <span className="text-[100px] text-[#2b3b7d] sm:text-[150px] m-0 letraC3 leading-none ">
          Shbeey
        </span>

        <h1 className="text-[60px] letraC leading-none ">¡Bienvenido!</h1>
        <p className="p-2 text-2xl text-center sm:text-3xl ">
          Siente la emoción de comunicarte con las manos. En nuestra plataforma,
          te acompañamos en tu viaje para aprender la Lengua de Señas Mexicana
          (LSM). ¡Un idioma lleno de vida y expresión!.
        </p>
        <p className="p-2 text-2xl text-center sm:text-3xl ">
          Descubre cursos, juegos y la detección de señas con ayuda de la
          inteligencia artificial de forma interactiva.
        </p>
        <br />
        <p className="font-bold text-center text-2xl">
          ¡Atrévete a aprender de una manera única!
        </p>
      </div>
      <p className="absolute bottom-0"> Shbeey®. Todos los derechos reservados 2025©.</p>
    </div>
  );
}
