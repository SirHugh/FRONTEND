import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import SuccessModal from "../SuccessModal";
import { createBeca, updateBeca } from "../../services/AcademicoService";
import toast, { Toaster } from "react-hot-toast";

const AgregarBecaModal = ({
  show,
  onClose,
  beca,
  setBeca,
  changed,
  setChanged,
  edit,
}) => {
  const [DisableButton, setDisableButton] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeca({ ...beca, [name]: value });
    setDisableButton(false);
  };

  const handdleSubmit = async (e) => {
    e.preventDefault();
    console.log("Beca: ", beca);
    try {
      if (edit) {
        await updateBeca(beca.id_beca, beca);
        onClose();
        setChanged(!changed);
        toast.success("Beca Actualizada", { duration: 5000 });
        return 0;
      }
      await createBeca(beca);
      setChanged(!changed);
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      toast.error("Error durante el registro.", error);
    }
    toast.success("Beca Creada", { duration: 5000 });
    onClose();
  };

  const onCloseModal = () => {
    setDisableButton(true);

    onClose();
  };

  return (
    <>
      <Modal show={show} size="lg" onClose={onCloseModal} popup>
        <Modal.Header>
          <div>Agregar Nueva Beca</div>
        </Modal.Header>
        <Modal.Body>
          <form
            className="flex flex-col gap-y-3"
            onSubmit={(e) => {
              if (window.confirm("Confirma Guardar?")) {
                handdleSubmit(e);
              } else {
                e.preventDefault();
                onClose();
              }
            }}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nombre" value="Nombre" />
              </div>
              <TextInput
                id="nombre"
                name="nombre"
                placeholder="Nombre de la Beca"
                value={beca.nombre}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="monto" value="Monto" />
                </div>
                <TextInput
                  type="number"
                  id="monto"
                  name="monto"
                  min={0}
                  placeholder="Monto de la beca(Gs.)"
                  value={beca.monto}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  className="w-48"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="porcentaje" value="Porcentaje" />
                </div>
                <TextInput
                  type="number"
                  name="porcentaje"
                  min={0}
                  max={100}
                  id="porcentaje"
                  placeholder="Porcentaje de descuento de la beca."
                  value={beca.porcentaje}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  className="w-48"
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="descripcion" value="Descripción" />
              </div>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción de la Beca."
                value={beca.descripcion}
                onChange={(e) => {
                  handleChange(e);
                }}
                rows={4}
                required
              />
            </div>
            <div className="flex mb-2 justify-end font-extralight">
              {!edit ? (
                <p className="text-red-400">
                  *Este registro sera creado con estado inactivo.
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="flex justify-end">
              <Button
                disabled={DisableButton}
                type="submit"
                className="flex flex-wrap p-1"
              >
                <IoAdd className="mr-2 h-5 w-5" />
                {!edit ? "Agregar Nueva Beca" : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgregarBecaModal;
