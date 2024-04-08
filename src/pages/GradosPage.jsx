import { useEffect, useState } from "react";
import { getGrados, getMatriculaAnioGrado } from "../services/AcademicoService";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";

function GradosPage() {
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [anio, setAnio] = useState(new Date().getFullYear());

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

  const listAlumnos = (id) => {
    const getList = async () => {
      const res = await getMatriculaAnioGrado(anio, id);
      if (res.status === 200) {
        setAlumnos(res.data);
        console.log("Alumnos:  ", alumnos);
      } else {
        alert(`No se encontraron estudiantes en este año y grado`);
        setAlumnos([]);
      }
    };
    getList();
  };

  return (
    <div className="bg-gray-400 h-full">
      <div className="flex w-full h-16 p-3 justify-between">
        <div className="flex items-center p-2 gap-3 text-3xl font-bold">
          <HiOutlineSquare3Stack3D />
          <h1 className="text-lg">Grados</h1>
        </div>
        <button className="bg-blue-900 rounded-md">Agregar Grado</button>
      </div>
      <div className="flex p-2 gap-2 items-center">
        <label htmlFor="anio" className="">
          Año Lectivo
        </label>
        <input
          name="añio"
          id="anio"
          className="w-40 h-10 bg-white p-3"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        ></input>
      </div>
      <div className="w-full items-start bg-black">
        <table className="w-full">
          <thead></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grados.map((grado) => (
              <tr
                key={grado.id_grado}
                className="text-right hover:bg-slate-500 cursor-pointer"
                onClick={() => listAlumnos(grado.id_grado)}
              >
                <td>{grado.grado}°</td>
                <td className="text-right pr-4">{grado.nombre}</td>
                <td>{grado.nivel}</td>
                <td>{grado.turno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" bg-green-300 w-full h-full">
        {alumnos.map((alumno) => (
          <p key={alumno.id_matricula}>
            {alumno.id_alumno.nombre} {alumno.id_alumno.apellido}
          </p>
        ))}
      </div>
    </div>
  );
}

export default GradosPage;
