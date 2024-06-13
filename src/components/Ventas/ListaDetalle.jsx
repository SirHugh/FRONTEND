import { useState } from "react";
import AsyncSelect from "react-select/async";
import { getProducto } from "../../services/CajaService";
import { Table, TextInput } from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";
import { CurrencyFormatter } from "../Constants";

function ListaDetalle({ detalleList, setDetalleList }) {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  const loadOptions = async () => {
    if (inputValue < 2) return;
    return getProducto("", "PR", 1, inputValue).then((result) => {
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
    const valueExist = detalleList.filter(
      (s) => s.id_producto == value.id_producto
    );
    console.log(valueExist);
    if (valueExist.length > 0) {
      return;
    }
    setDetalleList((prev) => [...prev, value]);
  };

  const handleRemoveItem = (index) => {
    const newArray = detalleList.filter((_, i) => i !== index);
    setDetalleList(newArray);
  };

  const handleCantidad = (e, index) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);

    setDetalleList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: Number(value) } : item
      )
    );
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p>Detalle de Venta</p>
        <div className="flex flex-col w-72">
          <AsyncSelect
            noOptionsMessage={() => "No se encuentran resultados"}
            placeholder="Buscar Producto..."
            cacheOptions
            defaultOptions
            value={selectedValue}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
            getOptionLabel={(e) => e.nombre}
            getOptionValue={(e) => e.id_producto}
          />
        </div>
      </div>
      <div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>% Iva</Table.HeadCell>
            <Table.HeadCell>Cantidad</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {detalleList?.map((d, index) => (
              <Table.Row key={d.id_producto}>
                <Table.Cell>{d.nombre}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(d.precio))}</Table.Cell>
                <Table.Cell>{d.iva === 0 ? "Exenta" : d.iva}</Table.Cell>
                <Table.Cell>
                  <TextInput
                    type="number"
                    min={1}
                    max={d.stock}
                    name="cantidad"
                    value={d.cantidad}
                    onChange={(e) => handleCantidad(e, index)}
                    autoComplete="off"
                  />
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(d.precio * d.cantidad) || 0)}
                </Table.Cell>
                <Table.Cell className="flex justify-end">
                  <HiOutlineTrash
                    className="cursor-pointer"
                    color="red"
                    size={"1.4rem"}
                    onClick={() => handleRemoveItem(index)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

export default ListaDetalle;
