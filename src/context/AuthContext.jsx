import React, { createContext, useEffect, useState } from "react";
import { Url } from "../BackUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AuthContext = createContext();
export default function AuthContextP({ children }) {
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");

    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const [user, setUser] = useState(() => {
    const username = getCookie("user");
    return username;
  });

  const [rol, setRol] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    obtenerRol();
  }, []);

  const login = async (user) => {
    try {
      const rest = await axios.post(
        `${Url}api/token/`,
        {
          username: user.username,
          password: user.password,
        },
        {
          withCredentials: true,
        }
      );
      // Guardar en cookies con expiración de 1 hora
      Cookies.set("user", rest.data.username, { expires: 1 }); // 1 hora
      Cookies.set("access", rest.data.access, { expires: 1 });
      setUser(rest.data.username);
      setRol(rest.data.rol);
      navigate("/home");
    } catch (error) {
      toast.error(
        <div>
          <strong>Error de autenticación</strong>
          <p>Usuario o contraseña incorrecta</p>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          className: "bg-red-300",
        }
      );
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${Url}logout/`,
        {},
        {
          withCredentials: true,
        }
      );
      Cookies.remove("user");
      Cookies.remove("access");

      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error cerrando sesión", error);
    }
  };

  const obtenerRol = async () => {
    try {
      const res = await axios.post(
        `${Url}usuario/`,
        { username: user },
        { withCredentials: true }
      );
      setRol(res.data.rol);
    } catch (error) {
      console.error("Error obteniendo el rol:", error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
