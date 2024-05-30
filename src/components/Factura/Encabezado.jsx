import React from "react";
import { DateFormatter } from "../Constants";

function Encabezado() {
  return (
    <div className="flex flex-row justify-between italic">
      {/* left side */}
      <div>
        <p className="font-bold text-xl uppercase">
          Fundación Unidos Por Cristo
        </p>
        <p>ruc 80028143-8</p>
        <p>Rojas Cañada n° 2985 </p>
        <p>fundacionupc@gmail.com</p>
        <p>Tel. 0981155115</p>
      </div>
      {/* right side */}
      <div className="flex flex-col items-end">
        <p className="font-bold text-xl uppercase">Nro. 001-001-000005</p>
        <p>Timbrado: 899384599 </p>
        <p>Validez 31/12/24</p>
        <p className="font-sans">
          Fecha: {DateFormatter(new Date()).toUpperCase()}
        </p>
        <p>Tipo: Contado</p>
      </div>
    </div>
  );
}

export default Encabezado;
