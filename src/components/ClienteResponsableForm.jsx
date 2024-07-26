import React, { useState, useEffect } from "react";
import { updateResponsable } from "../services/AcademicoService";
import { updateCliente } from "../services/CajaService";
import { TextInput, Checkbox, Button, Label, Modal } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { BiError } from "react-icons/bi";

const ClienteResponsableForm = ({ responsable, onClose, show }) => {
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
    id_alumno_id: "",
    id_cliente_id: "",
  });

  useEffect(() => {
    if (responsable) {
      setClienteData({
        cedula: responsable.cedula,
        ruc: responsable.ruc,
        nombre: responsable.nombre,
        apellido: responsable.apellido,
        telefono: responsable.telefono,
        email: responsable.email,
        direccion: responsable.direccion,
        tipo: responsable.tipo,
      });

      setResponsableData({
        ocupacion: responsable.ocupacion,
        tipo_relacion: responsable.tipo_relacion,
        es_activo: responsable.es_activo,
        id_alumno_id: responsable.id_alumno,
        id_cliente_id: responsable.id_cliente.id_cliente,
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
      await updateCliente(responsable.id_cliente, clienteData);
      //await updateResponsable(responsable.id_responsable, responsableData);

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
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex flex-row items-center gap-3">
          <h2 className="text-2xl font-bold">Editar Responsable</h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Toaster />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="ruc" className="w-1/4">
              RUC:
            </Label>
            <TextInput
              type="text"
              id="ruc"
              name="ruc"
              value={clienteData.ruc}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="ruc" className="w-1/4">
              Cedula:
            </Label>
            <TextInput
              type="text"
              id="cedula"
              name="cedula"
              value={clienteData.cedula}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="nombre" className="w-1/4">
              Nombre:
            </Label>
            <TextInput
              type="text"
              id="nombre"
              name="nombre"
              value={clienteData.nombre}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="apellido" className="w-1/4">
              Apellido:
            </Label>
            <TextInput
              type="text"
              id="apellido"
              name="apellido"
              value={clienteData.apellido}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="telefono" className="w-1/4">
              Teléfono:
            </Label>
            <TextInput
              type="text"
              id="telefono"
              name="telefono"
              value={clienteData.telefono}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="email" className="w-1/4">
              Email:
            </Label>
            <TextInput
              type="email"
              id="email"
              name="email"
              value={clienteData.email}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="direccion" className="w-1/4">
              Dirección:
            </Label>
            <TextInput
              type="text"
              id="direccion"
              name="direccion"
              value={clienteData.direccion}
              onChange={handleClienteChange}
              className="w-3/4"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="es_activo" className="w-1/4">
              Activo:
            </Label>
            <Checkbox
              id="es_activo"
              name="es_activo"
              checked={responsableData.es_activo}
              onChange={handleResponsableChange}
              className="ml-3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" color="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" color="blue">
              Guardar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ClienteResponsableForm;
