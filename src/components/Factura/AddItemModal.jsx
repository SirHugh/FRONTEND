import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TabItem,
  Table,
  Tabs,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getMatricula,
  getMatriculaResposable,
} from "../../services/AcademicoService";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { getArancel, getPagoVenta } from "../../services/CajaService";
import { CurrencyFormatter, DateFormatter } from "../Constants";
import { FaCashRegister } from "react-icons/fa";
import { FaBasketShopping, FaCartShopping } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";

const AddItemModal = ({ show, onClose, action, setData, cliente, load }) => {
  const [aranceles, setAranceles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);
  const [itemsApply, setItemsApply] = useState({
    aranceles: [],
    ventas: [],
  });
  const [searchOthers, setSearchOthers] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const displayed = useRef(false);

  useEffect(() => {
    if (show) {
      const loadAlumnos = async () => {
        if (!cliente) return;
        try {
          const res = await getMatriculaResposable(cliente);
          setAlumnos(res.data);
        } catch (error) {
          toast.error(error.message);
        }
      };
      loadAlumnos();
      displayed.current = true;
    }
  }, [show]);

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

  const handleChange = (value) => {
    setSelecteValue(value);
    console.log("Alumno: ", value);
    loadAranceles(value.id_matricula);
  };

  const loadAranceles = async (id) => {
    try {
      const res = await getArancel(true, id, new Date().getMonth() + 1);
      setAranceles(res.data);
      const res2 = await getPagoVenta(id, new Date().getMonth() + 1, true);
      setVentas(res2.data);
      console.log("aranceles: ", res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = (e, index) => {
    const { checked, name } = e.target;
    if (!checked) {
      if (name == "arancel") {
        const filteredAranceles = itemsApply.aranceles?.filter(
          (s) => s !== aranceles[index]
        );
        setItemsApply({ ...itemsApply, aranceles: filteredAranceles });
        console.log(itemsApply);
        return;
      }
      const filteredVentas = itemsApply.ventas?.filter(
        (s) => s !== ventas[index]
      );
      setItemsApply({ ...itemsApply, ventas: filteredVentas });
      return;
    }
    if (name == "arancel") {
      setItemsApply({
        ...itemsApply,
        aranceles: [...itemsApply.aranceles, aranceles[index]],
      });
      console.log(itemsApply);
      return;
    }
    setItemsApply({
      ...itemsApply,
      ventas: [...itemsApply.ventas, ventas[index]],
    });
    console.log(itemsApply);
  };

  const close = () => {
    setAranceles([]);
    setVentas([]);
    setItemsApply({
      aranceles: [],
      ventas: [],
    });
    setValue("");
    setSelecteValue(null);
    onClose();
  };

  const handleAction = () => {
    setData(itemsApply);
    close();
    action();
  };

  return (
    <>
      <Modal dismissible show={show} size="4xl" onClose={close} popup>
        <Modal.Header className="p-3">Agregar Concepto de Pago</Modal.Header>
        <Modal.Body className="py-2 border-y space-y-4">
          {searchOthers ? (
            <div>
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
            </div>
          ) : (
            <div>
              <Label>
                Alumno/s
                <Select
                  onChange={(e) => loadAranceles(e.target.value)}
                  multiple
                >
                  {alumnos?.map((alumno) => (
                    <option
                      key={alumno.id_matricula}
                      value={alumno.id_matricula}
                      className="hover:bg-blue-300"
                    >
                      {alumno.id_alumno.cedula +
                        " - " +
                        alumno.id_alumno.nombre +
                        " " +
                        alumno.id_alumno.apellido +
                        " - " +
                        alumno.id_grado.nombre}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
          )}

          <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
            <Tabs defaultIndex={0} onSelect={(index) => console.log(index)}>
              <TabItem active title="Aranceles" icon={FaCashRegister}>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>descripcion</Table.HeadCell>
                    <Table.HeadCell>nro. cuota</Table.HeadCell>
                    <Table.HeadCell>Vencimiento</Table.HeadCell>
                    <Table.HeadCell>monto</Table.HeadCell>
                    <Table.HeadCell>Agregar</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {aranceles.map((item, index) => (
                      <Table.Row
                        className="hover:bg-slate-100"
                        key={item.id_arancel}
                      >
                        <Table.Cell>{item.nombre}</Table.Cell>
                        <Table.Cell>{item.nro_cuota}</Table.Cell>
                        <Table.Cell>
                          {DateFormatter(new Date(item.fecha_vencimiento))}
                        </Table.Cell>
                        <Table.Cell>
                          {CurrencyFormatter(Number(item.monto))}
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox
                            name="arancel"
                            onChange={(e) => handleCheck(e, index)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TabItem>
              <TabItem active title="Ventas" icon={FaCartShopping}>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Concepto</Table.HeadCell>
                    <Table.HeadCell>nro. cuota</Table.HeadCell>
                    <Table.HeadCell>Vencimiento</Table.HeadCell>
                    <Table.HeadCell>monto</Table.HeadCell>
                    <Table.HeadCell>Agregar</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {ventas.map((item, index) => (
                      <Table.Row
                        className="hover:bg-slate-100"
                        key={item.id_arancel}
                      >
                        <Table.Cell>
                          {item.descripcion.map((d, index) => (
                            <p key={index}>
                              {d.producto + " - " + d.cantidad + " un"}
                            </p>
                          ))}
                        </Table.Cell>
                        <Table.Cell>
                          {item.nro_pago + "/" + item.nroPagos}
                        </Table.Cell>
                        <Table.Cell>
                          {DateFormatter(new Date(item.fecha_vencimiento))}
                        </Table.Cell>
                        <Table.Cell>
                          {CurrencyFormatter(Number(item.monto))}
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox
                            name="venta"
                            onChange={(e) => handleCheck(e, index)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TabItem>
            </Tabs>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit bg-cy p-4 gap-4 justify-end">
          {itemsApply.aranceles.length + itemsApply.ventas.length > 0 ? (
            <div className="flex flex-row text-cyan-600 font-bold items-center px-3 gap-x-2 border-2 rounded-full">
              {itemsApply.aranceles.length + itemsApply.ventas.length}
              <MdOutlinePostAdd fontSize={"1.1rem"} />
            </div>
          ) : (
            ""
          )}
          <Button
            disabled={
              itemsApply.aranceles.length == 0 && itemsApply.ventas.length == 0
                ? true
                : false
            }
            onClick={handleAction}
          >
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddItemModal;
