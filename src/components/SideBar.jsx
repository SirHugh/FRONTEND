import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Importa tu logo aquí
import homeIcon from "../assets/icons/home.svg";
import userIcon from "../assets/icons/user.svg";
import logoutIcon from "../assets/icons/logout.svg";
import lockIcon from "../assets/icons/padlock.svg";
import cashIcon from "../assets/icons/cash.svg";
import downArrowIcon from "../assets/icons/down_arrow.svg";
import upArrowIcon from "../assets/icons/up_arrow.svg";
import profileIcon from "../assets/icons/profileIcon.svg";
import useAuth from "../hooks/useAuth";
import { FaStoreAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiLockOpenAlt, BiSidebar, BiTransfer } from "react-icons/bi";
import { RiSideBarLine } from "react-icons/ri";

// Define un array de objetos con la información de cada elemento del menú
const menuItems = [
  {
    text: "Inicio",
    allowedGroup: null, // Esto hace que sea visible para cualquier grupo
    icon: (
      <img
        src={homeIcon}
        alt="Inicio"
        className="w-5 h-5 mr-2 object-contain"
      />
    ),
    link: "/",
  },
  {
    text: "Perfil",
    allowedGroup: null, // Esto hace que sea visible para cualquier grupo
    icon: (
      <img
        src={profileIcon}
        alt="Perfil"
        className="w-5 h-5 mr-2 object-contain"
      />
    ),
    link: "/profile",
  },
  {
    text: "Administración",
    allowedGroup: "ADMIN",
    icon: <MdAdminPanelSettings className="w-6 h-6 mr-2 object-contain" />,
    subItems: [
      {
        text: "Usuarios",
        icon: (
          <img
            src={lockIcon}
            alt="Opción 1"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/usuarios",
      },
      {
        text: "Información",
        icon: (
          <img
            src={lockIcon}
            alt="Opción 1"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/basics",
      },
      {
        text: "Periodo Académico",
        icon: (
          <img
            src={lockIcon}
            alt="Periodo Académico"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/periodo",
      },
      // Agrega más subelementos según sea necesario
    ],
  },
  {
    text: "Comercial",
    allowedGroup: "ADMIN",
    icon: (
      <FaStoreAlt className="w-5 h-5 mr-2 object-contain" />
      // <img src={FaStore} alt="Caja" className="w-5 h-5 mr-2 object-contain" />
    ),
    subItems: [
      {
        text: "Productos",
        icon: (
          <img
            src={cashIcon}
            alt="Productos"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/productos",
      },
      {
        text: "Aranceles",
        icon: (
          <img
            src={cashIcon}
            alt="Aranceles"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/aranceles",
      },
      {
        text: "Actividades",
        icon: (
          <img
            src={cashIcon}
            alt="Actividades"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/actividades",
      },
      {
        text: "Inventario",
        icon: (
          <img
            src={cashIcon}
            alt="Inventario"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/inventario",
      },
    ],
  },
  {
    text: "Academico",
    allowedGroup: "ACADEMICO",
    icon: (
      <img
        src={userIcon}
        alt="Academico"
        className="w-5 h-5 mr-2 object-contain"
      />
    ),
    subItems: [
      {
        text: "Alumnos",
        icon: (
          <img
            src={userIcon}
            alt="Opción 1"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/alumnos",
      },
      {
        text: "Matriculaciones",
        icon: (
          <img
            src={userIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/matriculas",
      },
      {
        text: "Grados",
        icon: (
          <img
            src={userIcon}
            alt="Opción 3"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/grados",
      },
      {
        text: "Becas",
        icon: (
          <img
            src={userIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/Becas",
      },
      {
        text: "Responsables",
        icon: (
          <img
            src={userIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/responsables",
      },
    ],
  },
  {
    text: "Caja",
    allowedGroup: "CAJA",
    icon: (
      <img src={cashIcon} alt="Caja" className="w-5 h-5 mr-2 object-contain" />
    ),
    subItems: [
      {
        text: "Flujo de Caja",
        icon: (
          <img
            src={cashIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/flujoCaja",
      },
      {
        text: "Compras",
        icon: (
          <img
            src={cashIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/compras",
      },
      {
        text: "Ventas",
        icon: (
          <img
            src={cashIcon}
            alt="Opción 2"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/ventas",
      },
      {
        text: "Facturación",
        icon: (
          <img
            src={cashIcon}
            alt="Facturación"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/factura",
      },
      {
        text: "Timbrado",
        icon: (
          <img
            src={cashIcon}
            alt="Timbrado"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/timbrado",
      },
      {
        text: "Estado de cuentas",
        icon: (
          <img
            src={cashIcon}
            alt="Estado de cuentas"
            className="w-5 h-5 mr-2 object-contain"
          />
        ),
        link: "/estadoDeCuenta",
      },
      // Agrega más subelementos según sea necesario
    ],
  },

  // Agrega más elementos de menú según sea necesario
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logoutUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    Array(menuItems.length).fill(false)
  );

  const handleSubMenuToggle = (index) => {
    const newSubMenuOpen = [...isSubMenuOpen];
    newSubMenuOpen[index] = !newSubMenuOpen[index];
    setIsSubMenuOpen(newSubMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
    setShowText(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    setShowText(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`relative no-print top-0 left-0 h-screen bg-blue-400 text-white z-16 ${
        isExpanded ? "w-64" : "w-16"
      } transition-all`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 mb-12 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-8 h-8 mr-2 object-contain" />
        {isExpanded && (
          <p className="p-lucida-handwriting font-1 text-xs">
            Colegio Unidos por Cristo
          </p>
        )}
      </div>

      {/* <BiLockOpenAlt className="absolute -right-3 top-5 w-5 h-5 border rounded-full bg-white text-blue-950 text-3xl cursor-pointer"></BiLockOpenAlt> */}

      <ul>
        {menuItems.map((item, index) => (
          <>
            {(!item.allowedGroup ||
              user?.groups?.find((group) =>
                item.allowedGroup?.includes(group)
              )) && (
              <li
                className="mb-12 pl-4"
                key={index}
                onClick={() => handleSubMenuToggle(index)}
              >
                <div className="flex justify-between items-center w-full">
                  {item.subItems ? (
                    <div className="text-white hover:text-gray-300 cursor-pointer flex items-center">
                      {item.icon}
                      {showText && item.text}
                    </div>
                  ) : (
                    <Link
                      to={item.link}
                      className="text-white hover:text-gray-300 flex items-center"
                      onClick={toggleSidebar}
                    >
                      {item.icon}
                      {showText && item.text}
                    </Link>
                  )}
                  {item.subItems && (
                    <button
                      className={`ml-2 focus:outline-none ${
                        isExpanded ? "block" : "hidden"
                      }`}
                      onClick={() => handleSubMenuToggle(index)}
                    >
                      <img
                        src={isSubMenuOpen[index] ? upArrowIcon : downArrowIcon}
                        alt="Arrow"
                        className="w-4 h-4"
                      />
                    </button>
                  )}
                </div>
                {/* Agrega un submenú si existen subItems */}
                {item.subItems && isSubMenuOpen[index] && (
                  <ul className="pl-8">
                    {item.subItems.map((subItem, subIndex) => (
                      <li className="mb-2" key={subIndex}>
                        <div className="text-white flex items-center">
                          <Link
                            to={subItem.link}
                            className="text-white hover:text-gray-300 flex items-center"
                          >
                            {showText && subItem.text}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </>
        ))}
      </ul>
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 mr-4 flex items-center"
          >
            <img src={logoutIcon} className="w-5 h-5 mr-2 object-contain" />{" "}
            {/* Muestra siempre el icono */}
            {showText && "Cerrar sesión"}{" "}
            {/* Muestra el texto solo cuando showText es true */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
