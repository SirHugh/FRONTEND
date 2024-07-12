import { Button, Label, Table, TextInput, Tooltip } from "flowbite-react";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { addAjuste, getProducto } from "../../services/CajaService";
import { HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { BiDownArrowAlt, BiSave } from "react-icons/bi";
import HistoricoAjuste from "./HistoricoAjuste";

function AjusteInventario({ search }) {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);
  const [productosAjustar, setProductosAjustar] = useState([]);
  const [reloadHistorial, setReloadHistorial] = useState(false);

  const loadOptions = async () => {
    if (inputValue < 2) return;
    return getProducto("", "PR", 1, inputValue, true).then((result) => {
      const res = result.data.results;
      console.log(res);
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    const valueExist = productosAjustar.filter(
      (s) => s.id_producto == value.id_producto
    );
    if (valueExist.length > 0) {
      toast.error("El producto ya se encuentra en la lista");
      return;
    }
    setSelecteValue(value);
    console.log(value);
  };

  const validateInfo = () => {
    if (selectedValue == null) {
      toast.error("Debe seleccionar un producto");
      return false;
    }
    if (!selectedValue?.razon) {
      toast.error("Escribe el motivo");
      return false;
    }
    if (!selectedValue?.cantidad) {
      toast.error("Ingresa la cantidad a dar de baja");
      return false;
    }
    if (selectedValue?.cantidad > selectedValue?.stock) {
      toast.error("La cantidad no puede ser mayor al stock");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateInfo()) return;
    console.log(selectedValue);
    setProductosAjustar((prev) => [...prev, selectedValue]);
    setSelecteValue(null);
  };

  const handleRemoveItem = (indexItem) => {
    setProductosAjustar(
      productosAjustar.filter((item, index) => index !== indexItem)
    );
  };

  const handleChangeInfo = (e) => {
    var { name, value } = e.target;
    if (name == "cantidad" || name == "operacion") value = Number(value);
    console.log(name, value);
    console.log(selectedValue);
    setSelecteValue({ ...selectedValue, [name]: value });
  };

  const handleSave = async () => {
    const ajusteData = productosAjustar.map(
      ({ id_producto, cantidad, razon }) => {
        const value = cantidad * -1;
        return { id_producto, cantidad: value, razon };
      }
    );
    window.confirm("Guardar los ajustes de productos");
    console.log(ajusteData);
    try {
      const res = await addAjuste(ajusteData);
      console.log(res);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
      return;
    }
    setProductosAjustar([]);
    setReloadHistorial(!reloadHistorial);
  };

  return (
    <div className="flex flex-row w-full gap-2 p-2">
      <div className="flex flex-col h-fit border drop-shadow-lg shadow-lg rounded-lg py-2 px-2 gap-3 items-center">
        <div className="flex flex-col items-center">
          <big className="font-bold">Ajuste Inventario</big>
          <span className="font-serif">
            Formulario de ajuste por baja de inventario
          </span>
          <span className="text-red-700 font-thin">* Campos obligatorios</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <b className="text-xl">Buscar Articulo</b>
          <span className="text-red-700">*</span>
          <div className="w-80">
            <AsyncSelect
              noOptionsMessage={() => "No se encuentran resultados"}
              placeholder="Nombre, descripción..."
              cacheOptions
              defaultOptions
              value={selectedValue}
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
              onChange={handleChange}
              getOptionLabel={(e) => e.nombre}
              getOptionValue={(e) => e}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 justify-center">
          <div className="flex flex-row gap-2 w-full">
            <Label className="w-1/3">
              Nombre:
              <TextInput
                readOnly
                value={selectedValue ? selectedValue.nombre : ""}
              />
            </Label>
            <Label className="w-2/3">
              Descripcion:{" "}
              <TextInput
                type="text"
                readOnly
                value={selectedValue ? selectedValue.descripcion : ""}
              />
            </Label>
          </div>
          <div className="flex flex-row gap-4">
            <Label>
              Motivo: <c className="text-red-700">*</c>
              <TextInput
                type="text"
                name="razon"
                value={selectedValue ? selectedValue?.razon : ""}
                onChange={handleChangeInfo}
              />
            </Label>
            <Label>
              Cantidad: <c className="text-red-700">*</c>
              <TextInput
                type="number"
                min={1}
                name="cantidad"
                value={selectedValue ? selectedValue.cantidad : ""}
                onChange={handleChangeInfo}
              />
            </Label>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1 pt-3">
          <Button.Group className="justify-end self-end">
            <Button className="w-fit h-fit" color="gray" onClick={handleAdd}>
              <BiDownArrowAlt className="mr-2 h-5 w-5" />
              Agregar
            </Button>
            <Button
              color="gray"
              disabled={!productosAjustar.length}
              onClick={handleSave}
            >
              <BiSave className="mr-2 h-5 w-5" />
              Guardar
            </Button>
          </Button.Group>
          <div>
            <Table className="divide-y" hoverable>
              <Table.Head>
                <Table.HeadCell>Codigo</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Razon</Table.HeadCell>
                <Table.HeadCell>Cantidad</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {productosAjustar.map((producto, index) => (
                  <Table.Row key={producto.id_producto}>
                    <Table.Cell>{producto.id_producto}</Table.Cell>
                    <Table.Cell>{producto.nombre}</Table.Cell>
                    <Table.Cell>{producto.razon}</Table.Cell>
                    <Table.Cell>{producto.cantidad}</Table.Cell>
                    <Table.Cell>
                      <Tooltip placement="top" content="Quitar">
                        <HiOutlineTrash
                          className="cursor-pointer"
                          color="red"
                          size={"1.4rem"}
                          onClick={() => handleRemoveItem(index)}
                        />
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
      <HistoricoAjuste search={search} reload={reloadHistorial} />
    </div>
  );
}

export default AjusteInventario;
