import React, { useEffect, useState } from "react";
import TableroSenia from "./TableroSenia";
import axios from "axios";
import { Url } from "../../../BackUrl";
import ModalJuego from "../../Modal/ModalJuego";

export default function EscribirSenia() {
  const formInicial = {input1:"", input2:"", input3:"",input4:"", input5:""}

  const [tarjeta, setTarjeta] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [aciertos, setAciertos] = useState();
  const [fin, setFin] = useState(false);
  const [copiaTarjeta, setCopiaTarjeta] = useState([]);
  const [form, setForm] = useState(formInicial)

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const resultado = await axios.get(`${Url}/escribir_senia_id/4/`);
    setTarjeta(resultado.data);
    setCopiaTarjeta(resultado.data)
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
    const nuevasRespuestas = {};
    let a = 0;
    let i = 1;
    tarjeta.forEach((tarjeta) => {
      nuevasRespuestas[i] =
        respuestas[i]?.trim().toLowerCase() === tarjeta.texto.toLowerCase();
      if (nuevasRespuestas[tarjeta.id]) a++;
      i++;
    });
    setRespuestas(nuevasRespuestas);
    setAciertos(a);
    console.log(a);
    setFin(true);
  };

  const reintentar = () => {
    setTarjeta(copiaTarjeta)
    setAciertos(0);
    setRespuestas([])
    setForm(formInicial);
    setFin(false)
  };

  return (
    <div>
      <h1>Escribir señas</h1>

      <TableroSenia
        senias={tarjeta}
        respuestas={respuestas}
        onChange={handleInputChange}
        form={form}
      />

      <button
        onClick={VerificarRespuestas}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Verificar
      </button>

      <ModalJuego
        fin={fin}
        setFin={setFin}
        aciertos={aciertos}
        accion={reintentar}
      />
    </div>
  );
}
