import { Table } from "flowbite-react";
import { CurrencyFormatter, Months } from "../Constants";
import { HiOutlineTrash } from "react-icons/hi";

function DetalleFactura({ items, setItems }) {
  const log = 0;

  const handleRemoveItem = (index, name) => {
    if (name == "aranceles") {
      const newArray = items.aranceles.filter((_, i) => i !== index);
      console.log("remain: ", newArray);
      setItems((prevItems) => ({
        ...prevItems,
        aranceles: [...newArray],
      }));
      return;
    }
    const newArray = items.ventas.filter((_, i) => i !== index);
    setItems({ ...items, ventas: [...newArray] });
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
        <Table className="">
          <Table.Head className="">
            <Table.HeadCell>Alumno</Table.HeadCell>
            <Table.HeadCell>Concepto</Table.HeadCell>
            <Table.HeadCell>Importe Total</Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {items?.aranceles.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_arancel}>
                <Table.Cell>{item.alumno}</Table.Cell>
                <Table.Cell>
                  {item.nombre +
                    Months[new Date(item.fecha_vencimiento).getMonth()].name}
                </Table.Cell>
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
            {items?.ventas?.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_arancel}>
                <Table.Cell>{item.alumno}</Table.Cell>
                <Table.Cell>
                  {item.descripcion.map((d, index) => (
                    <p key={index}>{d.producto + ", "}</p>
                  ))}
                </Table.Cell>
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
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

export default DetalleFactura;
