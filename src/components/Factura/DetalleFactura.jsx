import { Table } from "flowbite-react";
import { CurrencyFormatter, Months } from "../Constants";
import { HiOutlineTrash } from "react-icons/hi";

function DetalleFactura({ items, setItems }) {
  const handleRemoveItem = (index, name) => {
    if (name == "aranceles") {
      const newArrayAranceles = items.aranceles.filter((_, i) => i !== index);
      const newArrayDescuento = items.descuentos?.filter((_, i) => i !== index);
      console.log("remain: ", newArrayAranceles);
      setItems((prevItems) => ({
        ...prevItems,
        aranceles: [...newArrayAranceles],
        descuentos: [...newArrayDescuento],
      }));
      return;
    }
    if (name == "ventas") {
      const newArray = items.ventas.filter((_, i) => i !== index);
      setItems({ ...items, ventas: [...newArray] });
      return;
    }
    const newArray = items.actividades.filter((_, i) => i !== index);
    setItems({ ...items, actividades: [...newArray] });
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
        <Table className="">
          <Table.Head className="">
            <Table.HeadCell>Descripcion</Table.HeadCell>
            <Table.HeadCell>Iva 5%</Table.HeadCell>
            <Table.HeadCell>Iva 10%</Table.HeadCell>
            <Table.HeadCell>Exenta</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {/* aranceles */}
            {items?.aranceles.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_arancel}>
                <Table.Cell>
                  {item.alumno}
                  {", "}
                  {item.nombre}
                  {", "}
                  {Months[new Date(item.fecha_vencimiento).getMonth()].name}
                </Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell className="flex justify-end">
                  <HiOutlineTrash
                    className="cursor-pointer"
                    color="red"
                    size={"1.4rem"}
                    onClick={() => handleRemoveItem(index, "aranceles")}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            {/* Ventas */}
            {items?.ventas.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_venta}>
                <Table.Cell>
                  {item.alumno}
                  {", "}
                  {item.descripcion.map((d, index) => (
                    <p key={index}>{d.producto + ", "}</p>
                  ))}
                </Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell className="flex justify-end">
                  <HiOutlineTrash
                    className="cursor-pointer"
                    color="red"
                    size={"1.4rem"}
                    onClick={() => handleRemoveItem(index, "ventas")}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            {/* actividades */}
            {items?.actividades.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_actividad}>
                <Table.Cell>
                  {item.alumno} {", "}
                  {item.actividad}
                </Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
                <Table.Cell className="flex justify-end">
                  <HiOutlineTrash
                    className="cursor-pointer"
                    color="red"
                    size={"1.4rem"}
                    onClick={() => handleRemoveItem(index, "actividad")}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            {items?.descuentos.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_actividad}>
                <Table.Cell>
                  {"Descuento "}
                  {item.nombre}
                  {", "}
                  {item.alumno}
                </Table.Cell>
                <Table.Cell className="text-right"></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>
                  {"-"}
                  {CurrencyFormatter(Number(item.monto))}
                </Table.Cell>
                <Table.Cell className="flex justify-end"></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

export default DetalleFactura;
