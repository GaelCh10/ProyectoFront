import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Url } from "../BackUrl";
import usuarioI from "../assets/IMG/user.png";

export default function PerfilPage() {
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    try {
      const res = await axios.post(
        `${Url}usuario/`,
        {
          username: user,
        },
        {
          withCredentials: true,
        }
      );
      setUsuario(res.data);
    } catch (error) {}
  };

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <div className="flex items-center flex-row sm:w-[60%] justify-center mt-2">
        <div className="flex w-full sm:w-[50%] flex-col justify-between">
          <div className="flex w-full justify-center">
            <img src={usuarioI} className="w-[25%] " />
          </div>
          <div className="flex flex-col p-[10px] items-start gap-2.5 text-2xl">
            <label className="textoA" htmlFor="">
              Usuario
            </label>
            <input
              type="text"
              className="w-full h-[45px] outline-none rounded-[10px] border-2 p-2 bg-white text-[20px]"
              id="username"
              name="username"
              value={user}
              disabled
            />
          </div>
          <div className="flex flex-col p-[10px] items-start gap-2.5 text-2xl">
            <label className="textoA" htmlFor="">
              Correo
            </label>
            <input
              type="email"
              className="w-full h-[45px] outline-none rounded-[10px] border-2 p-2 bg-white text-[20px]"
              id="email"
              name="email"
              value={usuario.email || ""}
              disabled
            />
          </div>
          <div className="flex mt-2 items-center justify-center w-full">
            <button
              type="button"
              className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 bg-red-400 text-2xl font-bold"
              onClick={() => logout()}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
