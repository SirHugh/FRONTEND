import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createTimbrado, updateTimbrado } from "../../services/CajaService";
import { formatNumber } from "../Constants";

function AgregarTimbradoModal({ show, onClose, timbrado, title }) {
  const [formData, setFormData] = useState(timbrado);

  useEffect(() => {
    if (timbrado) {
      setFormData(timbrado);
    }
  }, [timbrado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({ ...prevValues, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (formData.id_timbrado) {
        const res = await updateTimbrado(formData.id_timbrado, formData);
        console.log("Actalizado", res.data);
        close();
        toast.success("Timbrado Actualizado");
        return true;
      }
      const res = await createTimbrado(formData);
      console.log("Guardado", res.data);
      toast.success("Timbrado agregado.");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    close();
  };

  const close = () => {
    onClose();
  };

  return (
    <Modal show={show} onClose={close} size={"md"} popup>
      <Modal.Header>
        {formData.id_timbrado ? "Actualizar Timbrado" : "Agregar Timbrado"}
      </Modal.Header>
      <Modal.Body>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <Label>
              Numero de Timbrado <c className="text-red-700">*</c>
              <TextInput
                type="number"
                name="nro_timbrado"
                value={formData.nro_timbrado}
                onChange={(e) => handleChange(e)}
                required
              />
            </Label>
            <Label>
              Fecha de Inicio <c className="text-red-700">*</c>
              <TextInput
                type="date"
                name="fecha_desde"
                value={formData.fecha_desde}
                onChange={(e) => handleChange(e)}
                required
              />
            </Label>
            <Label>
              validez(hasta) <c className="text-red-700">*</c>
              <TextInput
                type="date"
                name="fecha_hasta"
                value={formData.fecha_hasta}
                onChange={(e) => handleChange(e)}
                required
                onBlur={() => {
                  formData.fecha_hasta < formData.fecha_desde
                    ? (toast.error(
                        "La fecha de valides debe ser mayor a la fecha de inicio."
                      ),
                      setFormData({ ...formData, ["fecha_hasta"]: "" }))
                    : "";
                }}
              />
            </Label>
            <Label>
              Primer numero <c className="text-red-700">*</c>
            </Label>
            <div className="flex flex-row gap-4">
              <div>
                <TextInput
                  type="number"
                  min={1}
                  max={999}
                  id="establecimiento"
                  name="establecimiento"
                  value={formatNumber(formData.establecimiento, 3)}
                  onChange={(e) => handleChange(e)}
                  placeholder="000"
                  autoComplete="off"
                  required
                  helperText={
                    <c className="font-extralight ">establecimiento</c>
                  }
                />
              </div>
              <div>
                <TextInput
                  type="number"
                  min={1}
                  max={999}
                  id="punto_expedicion"
                  name="punto_expedicion"
                  value={formatNumber(formData.punto_expedicion, 3)}
                  onChange={(e) => handleChange(e)}
                  placeholder="000"
                  autoComplete="off"
                  required
                  helperText={<c className="font-extralight ">p. expedición</c>}
                />
              </div>
              <div>
                <TextInput
                  type="number"
                  min={1}
                  max={9999999}
                  id="numero_inicial"
                  name="numero_inicial"
                  value={formatNumber(formData.numero_inicial, 7)}
                  onChange={(e) => handleChange(e)}
                  placeholder="0000000"
                  autoComplete="off"
                  required
                  helperText={<c className="font-extralight ">numeración</c>}
                />
              </div>
            </div>
            <Label>
              Último numero
              <div className="flex flex-row gap-4">
                <div>
                  <TextInput
                    type="number"
                    typeof="number"
                    min={1}
                    max={999}
                    mask="999"
                    id="establecimiento"
                    name="establecimiento"
                    value={formatNumber(formData.establecimiento, 3)}
                    onChange={(e) => handleChange(e)}
                    placeholder="000"
                    autoComplete="off"
                    readOnly
                    required
                  />
                </div>
                <div>
                  <TextInput
                    type="number"
                    min={1}
                    max={999}
                    id="punto_expedicion"
                    name="punto_expedicion"
                    value={formatNumber(formData.punto_expedicion, 3)}
                    onChange={(e) => handleChange(e)}
                    placeholder="000"
                    autoComplete="off"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <TextInput
                    type="number"
                    min={0}
                    max={9999999}
                    id="numero_final"
                    name="numero_final"
                    value={formatNumber(formData.numero_final || 0, 7)}
                    onChange={(e) => handleChange(e)}
                    placeholder="0000000"
                    autoComplete="off"
                  />
                </div>
              </div>
            </Label>
            <span className="text-red-700">* campos obligatorios</span>
            <div className="flex justify-end px-3 pt-5">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AgregarTimbradoModal;
