import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="flex justify-between items-center bg-blue-500 text-white py-4 px-6">
      <div>
        <Link to="/" className="text-white hover:text-gray-300 mr-4">
          Inicio
        </Link>
        {user && (
          <Link to="/alumnos" className="text-white hover:text-gray-300 mr-4">
            Alumnos
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <div className="flex items-center">
            <h2 className="mr-4">Hola, {user.nombre}.</h2>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-white hover:text-gray-300">
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
