import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/IMG/logo.png";
import { toast } from "react-toastify";

export default function FormAcceder({ cerrar }) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState();

  const { username, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (!username.trim()) {
      toast.error("Usuario requerido", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-300",
      });
    }
    if (!password.trim()) {
      toast.error("Contraseña requerida", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-300",
      });
    }

    if (username.trim() && password.trim()) {
      await login(user);
    }
  };

  return (
    <div className="flex flex-col w-[90%] p-4 bg-[#c7d9f6] rounded-2xl sm:w-[50%] md:w-[40%] lg:w-[30%] justify-center items-center">
      <div className="flex w-full h-[100px] justify-center mt-[15px] mb-[15px]">
        <img className="w-[100px]" src={logo} />
      </div>
      <h3 className="text-3xl">Ingresar</h3>

      <form>
        <div className="flex flex-col p-[10px] items-center gap-2.5">
          <label className="textoA" htmlFor="">
            Usuario
          </label>
          <input
            type="text"
            className="w-full h-[35px] outline-none rounded-[10px] border-2 p-2 bg-white"
            id="username"
            name="username"
            value={username}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div className="flex flex-col p-[10px] items-center gap-2.5">
          <label className="textoA" htmlFor="">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full h-[35px] outline-none rounded-[10px] border-2 p-2 bg-white"
            id="password"
            name="password"
            value={password}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <p className="bg-red-500">{mensaje}</p>
        <div className="divBotones space-x-1 mt-2">
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-[#517fe0]"
            onClick={onSubmit}
          >
            Ingresar
          </button>
          <button
            type="button"
            className="w-[150px] h-[40px] rounded-[10px] mt-2.5 mb-2.5 border-2 bg-[#72a0e8]"
            onClick={cerrar}
          >
            Cancelar
          </button>
        </div>
      </form>

      <NavLink to={"/recuperar"}>¿Olvidaste tu contraseña?</NavLink>
    </div>
  );
}
