// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import AlumnosPage from "./AlumnosPage";

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenido a la pagina principal</h1>
      <Link to="/alumnos">Alumnos</Link>
    </div>
  );
};

export default HomePage;
