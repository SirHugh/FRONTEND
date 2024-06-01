import React, { useState, useEffect } from "react";
import { updateResponsable } from "../services/AcademicoService";
import { updateCliente } from "../services/CajaService";
import { TextInput, Checkbox, Button } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { BiError } from "react-icons/bi";

const ClienteResponsableForm = ({ responsable, onClose }) => {
  const [clienteData, setClienteData] = useState({
    cedula: "",
    ruc: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    tipo: "",
  });

  const [responsableData, setResponsableData] = useState({
    ocupacion: "",
    tipo_relacion: "",
    es_activo: false,
  });

  useEffect(() => {
    if (responsable) {
      setClienteData({
        cedula: responsable.id_cliente.cedula,
        ruc: responsable.id_cliente.ruc,
        nombre: responsable.id_cliente.nombre,
        apellido: responsable.id_cliente.apellido,
        telefono: responsable.id_cliente.telefono,
        email: responsable.id_cliente.email,
        direccion: responsable.id_cliente.direccion,
        tipo: responsable.id_cliente.tipo,
      });

      setResponsableData({
        ocupacion: responsable.ocupacion,
        tipo_relacion: responsable.tipo_relacion,
        es_activo: responsable.es_activo,
      });
    }
  }, [responsable]);

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setClienteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResponsableChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setResponsableData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCliente(clienteData.cedula, clienteData);
      await updateResponsable(responsable.id_responsable, responsableData);

      toast.success("Datos actualizados exitosamente!", { duration: 5000 });
      onClose();
    } catch (error) {
      toast.error("Error al actualizar los datos", {
        duration: 5000,
        icon: <BiError color="red" fontSize="5.5rem" />,
      });
      console.error("Error al actualizar los datos:", error);
    }
  };

  return (
    <div className="absolute z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Toaster />
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        <div className="bg-white w-full max-w-lg mx-auto p-8 rounded-md shadow-xl z-50">
          <h2 className="text-2xl font-bold mb-6">Editar Responsable</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del Cliente */}
            {/*<div>
              <label htmlFor="cedula" className="block text-base font-medium text-gray-700">
                Cédula
              </label>
              <TextInput
                type="text"
                id="cedula"
                name="cedula"
                value={clienteData.cedula}
                onChange={handleClienteChange}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            */}
            <div>
              <label htmlFor="ruc" className="block text-base font-medium text-gray-700">
                RUC
              </label>
              <TextInput
                type="text"
                id="ruc"
                name="ruc"
                value={clienteData.ruc}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            <div>
              <label htmlFor="nombre" className="block text-base font-medium text-gray-700">
                Nombre
              </label>
              <TextInput
                type="text"
                id="nombre"
                name="nombre"
                value={clienteData.nombre}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-base font-medium text-gray-700">
                Apellido
              </label>
              <TextInput
                type="text"
                id="apellido"
                name="apellido"
                value={clienteData.apellido}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-base font-medium text-gray-700">
                Teléfono
              </label>
              <TextInput
                type="text"
                id="telefono"
                name="telefono"
                value={clienteData.telefono}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">
                Email
              </label>
              <TextInput
                type="email"
                id="email"
                name="email"
                value={clienteData.email}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            <div>
              <label htmlFor="direccion" className="block text-base font-medium text-gray-700">
                Dirección
              </label>
              <TextInput
                type="text"
                id="direccion"
                name="direccion"
                value={clienteData.direccion}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
            {/*<div>
              <label htmlFor="tipo" className="block text-base font-medium text-gray-700">
                Tipo
              </label>
              <TextInput
                type="text"
                id="tipo"
                name="tipo"
                value={clienteData.tipo}
                onChange={handleClienteChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>*/}
            
            {/* Campos del Responsable */}
            <div>
              <label htmlFor="ocupacion" className="block text-base font-medium text-gray-700">
                Ocupación
              </label>
              <TextInput
                type="text"
                id="ocupacion"
                name="ocupacion"
                value={responsableData.ocupacion}
                onChange={handleResponsableChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
           {/* <div>
              <label htmlFor="tipo_relacion" className="block text-base font-medium text-gray-700">
                Tipo de Relación
              </label>
              <TextInput
                type="text"
                id="tipo_relacion"
                name="tipo_relacion"
                value={responsableData.tipo_relacion}
                onChange={handleResponsableChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none"
              />
            </div>
        */}
            <div className="flex items-center">
              <label htmlFor="es_activo" className="block text-base font-medium text-gray-700">
                Activo
              </label>
              <Checkbox
                id="es_activo"
                name="es_activo"
                checked={responsableData.es_activo}
                onChange={handleResponsableChange}
                className="ml-3"
              />
            </div>
            <div className="flex justify-end">
              <Button type="button" color="gray" onClick={onClose} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit" color="blue">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteResponsableForm;
