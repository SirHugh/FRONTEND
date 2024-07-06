import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import logoutIcon from '../assets/icons/logout.svg';
import BuscadorAlumnos from "./Ventas/BuscadorAlumnos";

const Header = ({ toggleSidebar }) => {
  const { user, logoutUser } = useContext(AuthContext);
  
  const handleLogout = () => {
    logoutUser();
  };

  // Verificar si el usuario está autenticado
  if (!user) {
    return null; // No renderizar el header si el usuario no está autenticado
  }

  // Verificar si el usuario pertenece al grupo CAJA
  const esGrupoCaja = user.groups.includes("CAJA");

  return (
    <div className="flex justify-between items-center bg-blue-500 text-white py-4 px-6">
      <div>

      </div>
      <div>
        <div className="flex items-center">
          <h2 className="mr-4">Hola, {user.nombre}.</h2>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300"
          >
            <img src={logoutIcon} className="w-5 h-5 mr-2 object-contain" title="Cerrar sesión" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
