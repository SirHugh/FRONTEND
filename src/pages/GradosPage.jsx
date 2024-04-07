import React, { useEffect } from "react";
import { ApiClient } from "../services/ApiClient";
import { getGrados } from "../services/AcademicoService";

function GradosPage() {
  const [grados, setGrados] = React.useState([]);

  useEffect(() => {
    const loadGrados = async () => {
      const res = await getGrados();
      console.log("Got grados: ", res);
      if (res.status == 200) {
        setGrados(res.data);
      } else {
        console.error("Error al cargar los grados:", res.message);
      }
    };
    loadGrados();
  }, []);
  return (
    <div className="grid grid-flow-row  px-10 bg-gray-800 text-white">
      <div className="flex w-full h-10 justify-between">
        <h1 className="">Grados</h1>
        <button className="bg-blue-900 rounded-md">Agregar Grado</button>
      </div>
      <div>
        <table>
          <thead></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grados.map((grado) => (
              <tr key={grado.id}>
                <td>{grado.grado}°</td>
                <td className="text-right pr-4">{grado.nombre}</td>
                <td>{grado.nivel}</td>
                <td>{grado.turno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradosPage;
