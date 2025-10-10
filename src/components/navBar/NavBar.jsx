import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/IMG/logo.png";
import { SideContext } from "../../context/SideBarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const { setSideActivo } = useContext(SideContext);
  const { sideActivo } = useContext(SideContext);

  return (
    <>
      {user && (
        <div className="flex w-full h-16 bg-[#0b1973] justify-center items-center text-white relative">
          <button
            className="absolute start-2 sm:start-5"
            onClick={() => setSideActivo(!sideActivo)}
          >
            <FontAwesomeIcon className="iconF" icon={faBars} size="xl" />
          </button>
          <img src={logo} className=" h-[90%] absolute end-2 sm:end-5" />
          <h1 className="text-2xl sm:text-[40px] letraC text-[#fff] tracking-widest">
            ¡Aprendiendo con señas!
          </h1>
        </div>
      )}
    </>
  );
}
