// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenido a la pagina principal</h1>
      <Link to="/alumnos">Alumnos</Link>
      <br />
      <Link to="/responsables">Responsables</Link>
    </div>
  );
};

export default HomePage;
