import React, { useEffect, useState } from "react";
import BlockSenia from "./BlockSenia";
import axios from "axios";
import { Url } from "../../../BackUrl";
import ModalJuego from "../../Modal/ModalJuego";
import { useParams } from "react-router-dom";
import Regresar from "../../elementos/Regresar";
import Swal from "sweetalert2";
import finS from './../../../assets/Audio/fin.mp3'
import useSound from "use-sound";

export default function TableroSenia() {
  const formInicial = {
    input0: "",
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  };

  const [playFin] = useSound(finS)
  

  const [tarjeta, setTarjeta] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [mensaje, setMensaje] = useState("Lo has logrado");
  const [fin, setFin] = useState(false);
  const [copiaTarjeta, setCopiaTarjeta] = useState([]);
  const [form, setForm] = useState(formInicial);
  const { id } = useParams();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const resultado = await axios.get(`${Url}escribir_senia_id/${id}/`);
    setTarjeta(resultado.data);
    setCopiaTarjeta(resultado.data);
  };

  const handleInputChange = (id, value) => {
    setForm((prev) => ({
      ...prev,
      [`input${id}`]: value,
    }));
    setRespuestas((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const VerificarRespuestas = () => {
    setFin(false);
    for (let inp in formInicial) {
      if (form[inp] == "") {
        Swal.fire({
          title: "Rellena primero todos los campos",
          icon: "error",
        });
        return;
      }
    }
    const nuevasRespuestas = {};
    let a = 0;
    let i = 0;
    for (let i = 0; i < tarjeta.length; i++) {
      const tarjetaActual = tarjeta[i];
      const respuestaUsuario = respuestas[i]?.trim().toLowerCase();
      const respuestaCorrecta = tarjetaActual.texto.toLowerCase();

      if (respuestaUsuario === respuestaCorrecta) {
        nuevasRespuestas[i] = true;
        a++;
      } else {
        nuevasRespuestas[i] = false;
        Swal.fire({
          title: "¡Intenta de nuevo!",
          text: "Algunas respuestas son incorrectas. Sigue intentando.",
          icon: "error",
        });
        return;
      }
    }

    setRespuestas(nuevasRespuestas);
    playFin();
    setFin(true);
  };

  const reintentar = () => {
    setTarjeta(copiaTarjeta);
    setRespuestas([]);
    setForm(formInicial);
    setFin(false);
  };
  return (
    <div className="flex flex-1 w-full items-center flex-col relative 2xl:space-y-5 overflow-hidden">
      <Regresar />
      <h1 className="font-bold text-4xl sm:my-8 text-center text-[#1e264d] bg-clip-text bg-gradient-to-r  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl">
        Escribe la seña
      </h1>
      {/* <p className="text-2xl">Escribe la letra de la seña</p> */}
      <h1 className="text-2xl font-bold">Instrucción:</h1>
      <p className="text-center text-md sm:text-2xl">
        Escribe la letra que corresponda la seña, puede ser en mayúscula o
        minúscula
      </p>
      <div className="flex flex-1 flex-col items-center 2xl:h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row mt-5 overflow-auto">
          {tarjeta.map((senia, index) => {
            return (
              <BlockSenia
                key={senia.id}
                blocksenia={senia}
                respuesta={respuestas[index]}
                onChange={handleInputChange}
                i={index}
                value={form[`input${index}`]}
                name={`input${index}`}
              />
            );
          })}
        </div>

        <button
          onClick={VerificarRespuestas}
          className="px-4 py-2 mt-3 w-[150px] text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Verificar
        </button>
      </div>

      <ModalJuego
        fin={fin}
        mensaje={mensaje}
        setFin={setFin}
        accion={reintentar}
      />
    </div>
  );
}
