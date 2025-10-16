import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import CursosPage from "../pages/CursosPage";
import JuegosPage from "../pages/JuegosPage";
import MemoramaPage from "../pages/juegos/MemoramaPage";
import Memorama from "../components/juegos/memorama/Memorama";
import EscribirSeniaPage from "../pages/juegos/EscribirSeniaPage";
import TableroSenia from "../components/juegos/escribirSenia/TableroSenia";
import CrucigramaPage from "../pages/juegos/CrucigramaPage";
import CMuebles from "../components/juegos/crucigrama/CMuebles";
import CFamilia from "../components/juegos/crucigrama/CFamilia";
import CDeportes from "../components/juegos/crucigrama/CDeportes";
import CAnimales from "../components/juegos/crucigrama/CAnimales";
import ContenidoCursoPage from "../pages/cursos/ContenidoCursoPage";
import DiccionarioPage from "../pages/DiccionarioPage";
import CursoPage from "../pages/cursos/CursoPage";
import CategoriaPage from "../pages/cursos/CategoriaPage";
import ContenidoPage from "../pages/cursos/ContenidoPage";
import OrdenarPalabraPage from "../pages/juegos/OrdenarPalabraPage";
import OrdenarPalabra from "../components/juegos/ordenarPalabra/OrdenarPalabra";
import FormarPalabrasPage from "../pages/juegos/FormarPalabrasPage";
import FormarPalabras from "../components/juegos/formarPalabras/FormarPalabras";
import EncontrarParesPage from "../pages/juegos/EncontrarParesPage";
import EncontrarPares from "../components/juegos/encontrarPares/EncontrarPares";
import PerfilPage from "../pages/PerfilPage";
import SopaLetraPage from "../pages/juegos/SopaLetraPage";
import SopaAnimales from "../components/juegos/sopa/SopaAnimales";
import DetectorSenias from "../components/detector/DetectorSenias";
import SopaPrendas from "../components/juegos/sopa/SopaPrendas";
import ACursosPage from "../pages/AdministradorPage/ACursosPage";
import ForoPage from "../pages/ForoPage";
import TraductorPage from "../pages/TraductorPage";
import DetalleForoPage from "../pages/foro/DetalleForoPage";
import ATemasPage from "../pages/AdministradorPage/ATemasPage";
import FormOlvidarContraseni from "../components/Formularios/FormOlvidarContraseni";
import FormCambiarContrasenia from "../components/Formularios/FormCambiarContrasenia";
import AEvaluacionPage from "../pages/AdministradorPage/AEvaluacionPage";
import APreguntasPage from "../pages/AdministradorPage/APreguntasPage";
import Evaluacion from "../components/evaluacion/Evaluacion";
import ACalificacionEstudiantes from "../pages/AdministradorPage/ACalificacionEstudiantes";
import HandModel from "../components/detector/ManoVirtual";
import DetectorInteractivo from "../components/detector/ManoInteractiva";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute acceso="noAcceso">
            <LoginPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recuperar"
        element={
          <PrivateRoute acceso="noAcceso">
            <FormOlvidarContraseni />
          </PrivateRoute>
        }
      />
      <Route
        path="/cambiar-password/:uid/:token"
        element={
          <PrivateRoute acceso="noAcceso">
            <FormCambiarContrasenia />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute acceso="acceso">
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos"
        element={
          <PrivateRoute acceso="acceso">
            <CursosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/diccionario"
        element={
          <PrivateRoute acceso="acceso">
            <DiccionarioPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos/curso/evaluacion/:id"
        element={
          <PrivateRoute acceso="acceso">
            <Evaluacion />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos/categoria/:id"
        element={
          <PrivateRoute acceso="acceso">
            <CategoriaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos/curso/:id"
        element={
          <PrivateRoute acceso="acceso">
            <CursoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos/curso/temas/:id"
        element={
          <PrivateRoute acceso="acceso">
            <ContenidoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cursos/curso/tema/:id"
        element={
          <PrivateRoute acceso="acceso">
            <ContenidoCursoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos"
        element={
          <PrivateRoute acceso="acceso">
            <JuegosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/memorama"
        element={
          <PrivateRoute acceso="acceso">
            <MemoramaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/memorama/:id"
        element={
          <PrivateRoute acceso="acceso">
            <Memorama />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/escribir_sena"
        element={
          <PrivateRoute acceso="acceso">
            <EscribirSeniaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/escribir_sena/:id"
        element={
          <PrivateRoute acceso="acceso">
            <TableroSenia />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/crucigrama"
        element={
          <PrivateRoute acceso="acceso">
            <CrucigramaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/crucigrama/muebles"
        element={
          <PrivateRoute acceso="acceso">
            <CMuebles />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/crucigrama/familia"
        element={
          <PrivateRoute acceso="acceso">
            <CFamilia />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/crucigrama/deportes"
        element={
          <PrivateRoute acceso="acceso">
            <CDeportes />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/crucigrama/animales"
        element={
          <PrivateRoute acceso="acceso">
            <CAnimales />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/ordenar_palabra"
        element={
          <PrivateRoute acceso="acceso">
            <OrdenarPalabraPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/ordenar_palabra/:id"
        element={
          <PrivateRoute acceso="acceso">
            <OrdenarPalabra />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/formar_palabras"
        element={
          <PrivateRoute acceso="acceso">
            <FormarPalabrasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/formar_palabras/:id"
        element={
          <PrivateRoute acceso="acceso">
            <FormarPalabras />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/encontrar_pares"
        element={
          <PrivateRoute acceso="acceso">
            <EncontrarParesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/encontrar_pares/:id"
        element={
          <PrivateRoute acceso="acceso">
            <EncontrarPares />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/sopaletra"
        element={
          <PrivateRoute acceso="acceso">
            <SopaLetraPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/sopaletra/animales"
        element={
          <PrivateRoute acceso="acceso">
            <SopaAnimales />
          </PrivateRoute>
        }
      />
      <Route
        path="/juegos/sopaletra/prendas"
        element={
          <PrivateRoute acceso="acceso">
            <SopaPrendas />
          </PrivateRoute>
        }
      />

      <Route
        path="/practicar"
        element={
          <PrivateRoute acceso="acceso">
            <DetectorSenias />
          </PrivateRoute>
        }
      />

      <Route path="/ManoVirtual"
        element={
          <PrivateRoute acceso="acceso">
            <DetectorInteractivo />
          </PrivateRoute>
        }
      />

      <Route
        path="/traductor"
        element={
          <PrivateRoute acceso="acceso">
            <TraductorPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/foro"
        element={
          <PrivateRoute acceso="acceso">
            <ForoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/foro/:id"
        element={
          <PrivateRoute acceso="acceso">
            <DetalleForoPage />
          </PrivateRoute>
        }
      />
      {/*Rutas opara el modulo de administraodr */}
      <Route
        path="/admin/cursos"
        element={
          <PrivateRoute acceso="acceso">
            <ACursosPage />
          </PrivateRoute>
        }
      />
      
       <Route
        path="/admin/cursos/:id"
        element={
          <PrivateRoute acceso="acceso">
            <ATemasPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/evaluacion"
        element={
          <PrivateRoute acceso="acceso">
            <AEvaluacionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/evaluacion/:id"
        element={
          <PrivateRoute acceso="acceso">
            <APreguntasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/evaluacion/calificacion/:id"
        element={
          <PrivateRoute acceso="acceso">
            <ACalificacionEstudiantes />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute acceso="acceso">
            <PerfilPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
