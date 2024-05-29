import { Button, Modal, Table } from "flowbite-react";
import { useState } from "react";
import { getMatricula } from "../../services/AcademicoService";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { getArancel } from "../../services/CajaService";

const AddItemModal = ({ show, onClose, action, setData }) => {
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  const loadOptions = async () => {
    if (inputValue < 2) return;
    return getMatricula("", "", inputValue, 1).then((result) => {
      const res = result.data.results;
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = async (value) => {
    setSelecteValue(value);
    console.log("Alumno: ", value);
    try {
      const res = await getArancel(
        true,
        value.id_matricula,
        new Date().getMonth() + 1
      );
      setItems(res.data);
      console.log("aranceles: ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const close = () => {
    setChecked(false);
    onClose();
  };

  const handleAction = () => {
    close();
    action();
  };

  return (
    <>
      <Modal dismissible show={show} size="4xl" onClose={close} popup>
        <Modal.Header className="p-3">Agregar Concepto de Pago</Modal.Header>
        <Modal.Body className="py-2 border-y space-y-4">
          <AsyncSelect
            noOptionsMessage={() => "No se encuentran resultados"}
            placeholder="Buscar Alumno..."
            cacheOptions
            defaultOptions
            value={selectedValue}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
            getOptionLabel={(e) =>
              e.id_alumno.nombre + " " + e.id_alumno.apellido
            }
            getOptionValue={(e) => e.id_matricula}
          />
          <div>
            <div>Datos del alumno</div>
            <div className="flex w-full border rounded-md p-3  h-14">
              {selectedValue ? (
                selectedValue?.id_alumno?.cedula +
                " - " +
                selectedValue?.id_alumno?.nombre +
                " " +
                selectedValue?.id_alumno?.apellido +
                " - " +
                selectedValue?.id_grado?.nombre
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
            <Table>
              <Table.Head>
                <Table.HeadCell>descripcion</Table.HeadCell>
                <Table.HeadCell>nro. cuota</Table.HeadCell>
                <Table.HeadCell>Vencimiento</Table.HeadCell>
                <Table.HeadCell>monto</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>Agregar</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id_arancel}>
                    <Table.Cell>{item.nombre}</Table.Cell>
                    <Table.Cell>{item.nro_cuota}</Table.Cell>
                    <Table.Cell>{item.fecha_vencimiento}</Table.Cell>
                    <Table.Cell>{item.monto}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button disabled={!checked} onClick={handleAction}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddItemModal;
