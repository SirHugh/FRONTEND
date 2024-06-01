import React, { useState, useEffect } from "react";
import {
  getGrados,
  getMatricula,
  setGradoActive,
  updateGrado,
} from "../services/AcademicoService";
import { HiOutlinePlus } from "react-icons/hi";
import AddGradoForm from "../components/AddGradoForm";
import EditGradoForm from "../components/EditGradoForm";
import toast, { Toaster } from "react-hot-toast";

function GradosPage() {
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrado, setSelectedGrado] = useState(null);

  useEffect(() => {
    const loadGrados = async () => {
      setLoading(true);
      const res = await getGrados();
      setLoading(false);
      if (res.status === 200) {
        setGrados(res.data);
      } else {
        console.error("Error al cargar los grados:", res.message);
      }
    };
    loadGrados();
  }, []);

  const listAlumnos = async (id, grado) => {
    setSelectedGrado(grado);
    setLoading(true);
    const res = await getMatricula(anio, id);
    setLoading(false);
    if (res.status === 200) {
      setAlumnos(res.data);
    } else {
      toast.error(`No se encontraron estudiantes en este año y grado`);
      setAlumnos([]);
    }
  };

  const handleShowFormModal = () => {
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedGrado(null);
  };

  const handleEditGrado = (grado) => {
    setSelectedGrado(grado);
    setShowModal(true);
  };

  const handleUpdateGrado = async (id, data) => {
    try {
      await updateGrado(id, data);
      setShowModal(false);
      const res = await getGrados();
      if (res.status === 200) {
        setGrados(res.data);
      } else {
        console.error("Error al cargar los grados:", res.message);
      }
    } catch (error) {
      console.error("Error al actualizar el grado:", error);
    }
  };

  const handleGradoActiveChange = async (id_grado, es_activo) => {
    try {
      await setGradoActive(id_grado, es_activo);
      setGrados((prevGrados) =>
        prevGrados.map((grado) =>
          grado.id_grado === id_grado ? { ...grado, es_activo } : grado
        )
      );
    } catch (error) {
      toast.error("Error al actualizar el estado del grado");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <HiOutlinePlus className="text-blue-500 text-2xl" />
          <h1 className="text-2xl">Grados</h1>
        </div>
        <button
          onClick={handleShowFormModal}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Agregar Grado
        </button>
      </div>
      {showFormModal && <AddGradoForm onClose={handleCloseFormModal} />}
      <div className="overflow-x-auto">
        {showModal && (
          <EditGradoForm
            initialData={selectedGrado}
            onUpdateGrado={handleUpdateGrado}
            onClose={() => setShowModal(false)}
          />
        )}
        <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Grado</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Nivel</th>
              <th className="px-4 py-2">Turno</th>
              <th className="px-4 py-2">Seccion</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grados.map((grado) => (
              <tr
                key={grado.id_grado}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => listAlumnos(grado.id_grado, grado)}
              >
                <td style={{ width: "10%" }} className="px-4 py-2">
                  {grado.grado}°
                </td>
                <td style={{ width: "20%" }} className="px-4 py-2">
                  {grado.nombre}
                </td>
                <td style={{ width: "20%" }} className="px-4 py-2">
                  {grado.nivel}
                </td>
                <td style={{ width: "20%" }} className="px-4 py-2">
                  {grado.turno}
                </td>
                <td style={{ width: "10%" }} className="px-4 py-2">
                  {grado.seccion}
                </td>
                <td
                  style={{ width: "20%", position: "relative" }}
                  className="px-4 py-2"
                >
                  {!showModal && !showFormModal && (
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={grado.es_activo}
                        onChange={(e) =>
                          handleGradoActiveChange(grado.id_grado, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ${
                          grado.es_activo
                            ? "peer-checked:bg-blue-600"
                            : "dark:bg-gray-700 peer-checked:bg-gray-600"
                        } dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}
                      ></div>
                      <span
                        className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        style={{ zIndex: 1 }}
                      >
                        {grado.es_activo ? "Activo" : "Inactivo"}
                      </span>
                    </label>
                  )}
                </td>

                <td style={{ width: "10%" }} className="px-4 py-2">
                  <button onClick={() => handleEditGrado(grado)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div></div>
    </div>
  );
}

export default GradosPage;
