import {
  Button,
  Label,
  Select,
  Table,
  TextInput,
  Textarea,
  Tooltip,
} from "flowbite-react";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { getProducto } from "../../services/CajaService";
import { Input } from "postcss";
import { HiOutlineTrash } from "react-icons/hi";

function AjusteInventario() {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);
  const [productosAjustar, setProductosAjustar] = useState([]);

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
    setSelecteValue(value);
    console.log(value);
  };

  const handleChangeSelectec = (e) => {
    const { name, value } = e.target;
  };

  const handleAdd = () => {
    const valueExist = productosAjustar.filter(
      (s) => s.id_producto == selectedValue.id_producto
    );
    console.log(valueExist);
    if (valueExist.length > 0) {
      return;
    }
    setProductosAjustar((prev) => [...prev, selectedValue]);
  };

  const handleRemoveItem = (indexItem) => {
    setProductosAjustar(
      productosAjustar.filter((item, index) => index !== indexItem)
    );
  };

  return (
    <div className="flex flex-col h-screen w-5/6 border drop-shadow-lg rounded-lg p-5 gap-3">
      <div>
        <big>Ajuste Inventario</big>
        <p>Este es el ajuste de inventario</p>
      </div>
      <Label className="flex items-center gap-3">
        <span className="text-xl">Buscar Articulo</span>
        <div className="flex flex-col w-80">
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
      </Label>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-2 w-full">
          <Label className="w-1/3">
            Nombre:
            <TextInput readOnly value={selectedValue?.nombre} />
          </Label>
          <Label className="w-2/3">
            Descripcion:{" "}
            <TextInput
              type="text"
              readOnly
              value={selectedValue?.descripcion}
            />
          </Label>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Label>
            Operación:
            <Select
              name="operacion"
              value={selectedValue?.operacion}
              onChange={() => {}}
            >
              <option value={0}></option>
              <option value={1}>Incremento</option>
              <option value={2}>Disminucion</option>
            </Select>
          </Label>
          <Label>
            Motivo:
            <TextInput type="text" name="razon" value={selectedValue?.razon} />
          </Label>
          <Label>
            Cantidad:
            <TextInput
              type="number"
              min={1}
              name="cantidad"
              value={selectedValue?.cantidad}
              onChange={() => {}}
            />
          </Label>
          <Button color="dark" onClick={handleAdd}>
            Agregar
          </Button>
        </div>
      </div>
      <div>
        <Table className="divide-y">
          <Table.Head>
            <Table.HeadCell>Codigo</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Operación</Table.HeadCell>
            <Table.HeadCell>Razon</Table.HeadCell>
            <Table.HeadCell>Cantidad</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {productosAjustar.map((producto, index) => (
              <Table.Row key={producto.id_producto}>
                <Table.Cell>{producto.id_producto}</Table.Cell>
                <Table.Cell>{producto.nombre}</Table.Cell>
                <Table.Cell>{} </Table.Cell>
                <Table.Cell>{}</Table.Cell>
                <Table.Cell>{}</Table.Cell>
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
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default AjusteInventario;
