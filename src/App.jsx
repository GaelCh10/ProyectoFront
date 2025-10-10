import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routers/AppRoutes";
import AuthContextP from "./context/AuthContext";
import SideBar from "./components/sideBar/SideBar";
import NavBar from "./components/navBar/NavBar";
import SideBarContext from "./context/SideBarContext";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

import axios from "axios";
const cookies = Cookies.get("access");

// Configuración global de Axios (se aplica a TODAS las peticiones)
axios.defaults.headers.common["Authorization"] = `Bearer ${cookies}`;

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthContextP>
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <SideBarContext>
              <SideBar />
              <div className="flex flex-col flex-1 h-full w-full">
                <NavBar />
                <AppRoutes />
              </div>
            </SideBarContext>
          </div>
        </AuthContextP>
      </BrowserRouter>
    </>
  );
}

export default App;
