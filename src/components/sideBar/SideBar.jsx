import React, { useContext, useEffect, useState } from "react";
import "./sideBar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/IMG/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBook,
  faCamera,
  faGamepad,
  faHouse,
  faBookOpenReader,
  faUser,
  faComments,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { SideContext } from "../../context/SideBarContext";

export default function SideBar() {
  const [visible, setVisible] = useState(true);
  const [esMovil, setEsMovil] = useState(window.innerWidth < 640);
  const { sideActivo } = useContext(SideContext);
  const { setSideActivo } = useContext(SideContext);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setVisible(false);
    }
  }, []);

  const handleClick = () => {
    setVisible(!visible);
  };

  const esEnMovil = () => {
    if (esMovil) {
      setVisible(false);
    }
  };
  const { user } = useContext(AuthContext);
  const { rol } = useContext(AuthContext);
  //console.log(user)
  //console.log(localStorage.getItem("tokens"))
  const { logout } = useContext(AuthContext);

  const salir = () => {
    logout();
  };

  return (
    <>
      {user && (
        <>
          <div className="flex w-full absolute flex-row top-16">
            <div
              className={`SideBar ${
                sideActivo ? "" : "oculto"
              } transform transition-transform duration-300 ease-in-out ${
                sideActivo ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* <div className="contenedorImg">
              <img className="ImgPerfil" src={logo} />
            </div> */}

              <ul className="nav-list" onClick={() => setSideActivo(false)}>
                <li>
                  <NavLink
                    activeclassname="active"
                    to={"/home"}
                    className="nav"
                  >
                    <div className="ContSide">
                      <FontAwesomeIcon
                        className="iconF"
                        icon={faHouse}
                        size="xl"
                      />
                      <span>Inicio</span>
                    </div>
                  </NavLink>
                </li>
                {rol == "Administrador" ? (
                  <>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/admin/cursos"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faBookOpenReader}
                            size="xl"
                          />
                          <span>Cursos</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/admin/evaluacion"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faBookOpenReader}
                            size="xl"
                          />
                          <span>Evaluacion</span>
                        </div>
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/cursos"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faBookOpenReader}
                            size="xl"
                          />
                          <span>Cursos</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/diccionario"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faBook}
                            size="xl"
                          />
                          <span>Diccionario</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/juegos"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faGamepad}
                            size="xl"
                          />
                          <span>Juegos</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/practicar"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faCamera}
                            size="xl"
                          />
                          <span>Detector de señas</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/traductor"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faLanguage}
                            size="xl"
                          />
                          <span>Traductor</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        to={"/foro"}
                        className="nav"
                      >
                        <div className="ContSide">
                          <FontAwesomeIcon
                            className="iconF"
                            icon={faComments}
                            size="xl"
                          />
                          <span>Foro</span>
                        </div>
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    activeclassname="active"
                    to={"/perfil"}
                    className="nav"
                  >
                    <div className="ContSide">
                      <FontAwesomeIcon
                        className="iconF"
                        icon={faUser}
                        size="xl"
                      />
                      <span>Perfil</span>
                    </div>
                  </NavLink>
                </li>
              </ul>

              {/* <div className={`BotonOcultar ${visible ? "" : "mostrar"} `}>
              <button className="bg-amber-50 rounded-3xl mt-3" onClick={logout}>
                Cerrar sesion
              </button>
              <button onClick={handleClick}>Ocultar</button>
            </div> */}
            </div>
            <div
              className="flex flex-1 inset-0 bg-black opacity-50 z-10"
              onClick={() => setSideActivo(false)}
            ></div>
          </div>

          {/* <button
            className={`BotonMostrar textoBlanco ${visible ? "oculto" : ""} `}
            onClick={handleClick}
          >
            Mostrar
          </button> */}
        </>
      )}
    </>
  );
}
