import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import backgroundImage from "../assets/loginBackground.jpg"; // Importa tu imagen de fondo aquí
import logo from "../assets/logo.png"; // Importa tu logo aquí

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Fondo */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Capa azul transparente */}
      <div className="absolute inset-0 bg-blue-500 opacity-70 z-0"></div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 max-w-md w-full">
        {/* Formulario */}
        <div className="bg-white bg-opacity-100 px-8 py-6 rounded-md shadow-lg">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Introduzca sus credenciales
          </h1>
          <form onSubmit={loginUser} className="space-y-4">
            <div className="relative">
              <input
                autoComplete="on" // activa el autocompletado
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                autoComplete="off" // Desactiva el autocompletado
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Logo y texto */}
      <div className="absolute top-0 left-0 ml-6 mt-6 text-white font-bold italic flex items-center font-serif z-10">
        <img src={logo} alt="Logo" className="w-20 h-20 mr-2" />
        <h1 className="p-lucida-handwriting">Colegio Unidos por Cristo</h1>
      </div>
    </div>
  );
};

export default LoginPage;
