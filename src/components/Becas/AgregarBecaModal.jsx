import {
  Button,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { createBeca, updateBeca } from "../../services/AcademicoService";
import toast from "react-hot-toast";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaDeleteLeft, FaX } from "react-icons/fa6";

const AgregarBecaModal = ({
  show,
  onClose,
  beca,
  setBeca,
  changed,
  setChanged,
  edit,
  aranceles,
}) => {
  const [DisableButton, setDisableButton] = useState(true);
  const [arancelAplicado, setArancelAplicado] = useState([]);
  const [remover, setRemover] = useState(null);
  const [agregar, setAgregar] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const ar = aranceles.filter((arancel) =>
      beca.arancel?.includes(arancel.id_producto)
    );
    setArancelAplicado(ar);
  }, [show, update]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeca({ ...beca, [name]: value });
    setDisableButton(false);
    console.log("Beca: ", beca);
  };

  const validateArancel = () => {
    if (beca.arancel.length == 0) {
      toast.error("Debe seleccionar al menos un arancel");
      return false;
    }
    return true;
  };

  const handdleSubmit = async (e) => {
    e.preventDefault();

    if (!validateArancel()) return;
    if (!window.confirm("Confirma Guardar?")) {
      return;
    }

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
      toast.success("Beca Creada", { duration: 5000 });
      setChanged(!changed);
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      toast.error("Error durante el registro.", error);
      console.log(error);
    }
    onClose();
  };

  const onCloseModal = () => {
    setDisableButton(true);

    onClose();
  };

  const agregarGrupo = () => {
    if (beca.arancel.includes(agregar)) {
      console.log("incluye", agregar);

      return;
    }
    setUpdate(!update);
    setBeca((prevFormValues) => {
      return {
        ...prevFormValues,
        arancel: [...prevFormValues.arancel, agregar],
      };
    });
  };

  const removerGrupo = () => {
    const ng = beca.arancel.filter((arancel) => arancel !== remover);
    console.log("remover:", ng);
    setBeca((prevFormValues) => {
      return {
        ...prevFormValues,
        arancel: [...ng],
      };
    });
    setUpdate(!update);
  };

  return (
    <>
      <Modal show={show} size="xl" onClose={onCloseModal} popup>
        <Modal.Header>
          <div>Agregar Nueva Beca</div>
        </Modal.Header>
        <Modal.Body>
          <form
            className="flex flex-col gap-y-3"
            onSubmit={(e) => handdleSubmit(e)}
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
            <div className="flex flex-col justify-between gap-2">
              <Label value="Descuento" />
              <div className="flex flex-row justify-between">
                <Label>
                  Tipo
                  <Select
                    name="tipo_monto"
                    value={beca.tipo_monto}
                    onChange={(e) => handleChange(e)}
                    className="w-48"
                    required
                  >
                    <option></option>
                    <option value={1}>Porcentaje</option>
                    <option value={2}>Monto Fijo</option>
                  </Select>
                </Label>
                <Label>
                  Valor
                  <TextInput
                    type="number"
                    name="monto"
                    min={1}
                    max={beca.tipo_monto == 1 ? 100 : null} // Aquí está el problema
                    id="monto"
                    placeholder="Porcentaje de descuento de la beca."
                    value={beca.monto}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    className="w-48"
                    required
                  />
                </Label>
              </div>
            </div>
            <div className="flex flex-row">
              <Label className="flex flex-col w-full">
                Aranceles
                <Select
                  name="aranceles"
                  onChange={(e) => setAgregar(Number(e.target.value))}
                  multiple
                  className="flex"
                >
                  {aranceles.map((ar) => (
                    <option key={ar.id_producto} value={ar.id_producto}>
                      {ar.nombre}
                    </option>
                  ))}
                </Select>
              </Label>
              <div className="flex flex-col gap-4 p-1 items-center justify-center">
                <div
                  className={` ${
                    agregar
                      ? "hover:cursor-pointer text-black"
                      : "text-gray-500"
                  }`}
                  onClick={() => (agregar ? agregarGrupo() : "")}
                >
                  <FaArrowAltCircleRight size="1.2rem" />
                </div>
                <div
                  className={` ${
                    remover
                      ? "hover:cursor-pointer text-black"
                      : "text-gray-500"
                  }`}
                  onClick={() => (remover ? removerGrupo() : "")}
                >
                  <FaDeleteLeft size="1.2rem" />
                </div>
              </div>
              <Label className="flex flex-col w-full">
                Aplicar
                <Select
                  name="arancel"
                  onChange={(e) => {
                    setRemover(Number(e.target.value));
                    console.log(remover);
                  }}
                  multiple={true}
                  className="flex"
                >
                  {arancelAplicado.map((ar) => (
                    <option key={ar.id_producto} value={ar.id_producto}>
                      {ar.nombre}
                    </option>
                  ))}
                </Select>
              </Label>
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
