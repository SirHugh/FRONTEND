import { Modal, Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { createPeriodo, updatePeriodo } from "../services/AcademicoService";
import toast from "react-hot-toast";

const AgregarPeriodoModal = ({ show, onClose, periodo }) => {
  const [formData, setFormData] = useState(periodo);

  useEffect(() => {
    setFormData(periodo);
  }, [periodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_periodo) {
        await updatePeriodo(formData.id_periodo, formData);
        toast.success("Periodo actualizado con éxito");
      } else {
        await createPeriodo(formData);
        toast.success("Periodo creado con éxito");
      }
      onClose();
    } catch (error) {
      toast.error("Error al guardar el periodo");
      console.error(error);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{formData.id_periodo ? "Editar Periodo" : "Agregar Periodo"}</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="periodo">Periodo</Label>
            <TextInput
              id="periodo"
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
            <TextInput
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha_fin">Fecha Fin</Label>
            <TextInput
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="vencimiento_pagos">Vencimiento Pagos (días)</Label>
            <TextInput
              id="vencimiento_pagos"
              name="vencimiento_pagos"
              type="number"
              value={formData.vencimiento_pagos}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarPeriodoModal;
