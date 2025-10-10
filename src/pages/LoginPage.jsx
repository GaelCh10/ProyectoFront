import React, { useState } from "react";
import Modal from "../components/Modal/Modal";
import logo from "../assets/IMG/logo.png";
import FormAcceder from "../components/Formularios/FormAcceder";
import FormCrearCuenta from "../components/Formularios/FormCrearCuenta";

export default function LoginPage() {
  const [modalO, setModalO] = useState(false);
  const [modalC, setModalC] = useState(false);
  

  const abrirModal = () => {
    setModalO(true);
  };
  const cerrarModal = () => {
    setModalO(false);
  };

  const abrirModalC = () => {
    setModalC(true);
  };
  const cerrarModalC = () => {
    setModalC(false);
  };
  return (
    <div className="w-full h-screen flex flex-col flex-1">
      <div className="flex bg-[#0b1973] w-full h-32 sm:h-16  text-white sm:items-center  justify-center relative">
        <img src={logo} className="h-[45%] sm:h-[90%] absolute start-5" />

        <h1 className="text-[40px] letraC text-[#fff000] absolute">
          ¡Aprendiendo con señas!
        </h1>

        <div className="flex bottom-5  sm:end-8 absolute space-x-6">
          <button
            className="w-[100px] h-[35px] border border-[#fca404] text-white bg-[#242724]"
            onClick={abrirModal}
          >
            Acceder
          </button>

          <button
            className="w-[150px] h-[35px] border border-black bg-[#fca404]"
            onClick={abrirModalC}
          >
            Crear cuenta
          </button>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center">
        <div className="flex items-center flex-col sm:w-[80%] mt-2">
          <span className="text-[100px] text-[#2b3b7d] sm:text-[150px] m-0 letraC3 leading-none ">
            Shbeey
          </span>

          <h1 className="text-[60px] letraC leading-none ">¡Bienvenido!</h1>
          <p className="p-2 text-2xl text-center sm:text-3xl ">
            Siente la emoción de comunicarte con las manos. En nuestra
            plataforma, te acompañamos en tu viaje para aprender la Lengua de
            Señas Mexicana (LSM). ¡Un idioma lleno de vida y expresión!.
          </p>
          <p className="p-2 text-2xl text-center sm:text-3xl ">
            Descubre cursos, juegos y la detección de señas con ayuda de la
            inteligencia artificial de forma interactiva.
          </p>
          <br />
          <p className="font-bold text-2xl text-center">
            ¡Atrévete a aprender de una manera única!
          </p>
        </div>
      </div>
      {modalO && (
        <Modal modal={modalO}>
          <FormAcceder cerrar={cerrarModal} />
        </Modal>
      )}
      {modalC && (
        <Modal modal={modalC}>
          <FormCrearCuenta cancelar={cerrarModalC} />
        </Modal>
      )}
    </div>
  );
}
