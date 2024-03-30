import { useEffect, useState } from "react";

function ResponablesTable(student_id) {
  const [responsables, setResponsables] = useState([
    {
      id: "",
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
      relacion: "",
    },
  ]);

  useEffect(() => {}, []);

  return (
    <div className="relative flex z-0 w-full h-20 mb-5 group">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Apellido
            </th>
            <th scope="col" className="px-6 py-3">
              Telefono
            </th>
            <th scope="col" className="px-6 py-3">
              Parentesco
            </th>
          </tr>
        </thead>
        <tbody>
          {responsables?.map((responsable, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {responsable.nombre}
              </th>
              <td className="px-6 py-4">{responsable.apellido}</td>
              <td className="px-6 py-4">{responsable.telefono}</td>
              <td className="px-6 py-4">{responsable.relacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResponablesTable;
