import { Table } from "flowbite-react";
import { CurrencyFormatter, Months } from "../Constants";
import { HiOutlineTrash } from "react-icons/hi";

function DetalleFactura({ items, setItems }) {
  const handleRemoveItem = (index) => {
    console.log("clicked");
    const newArray = items.filter((_, i) => i !== index);
    setItems(newArray);
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
        <Table className="">
          <Table.Head className="">
            <Table.HeadCell>N°</Table.HeadCell>
            <Table.HeadCell>Concepto</Table.HeadCell>
            <Table.HeadCell>Importe Total</Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {items?.map((item, index) => (
              <Table.Row className="hover:bg-slate-100" key={item.id_arancel}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  {item.alumno +
                    " - " +
                    item.nombre +
                    ", mes " +
                    Months[new Date(item.fecha_vencimiento).getMonth()].name}
                </Table.Cell>
                <Table.Cell>{CurrencyFormatter(Number(item.monto))}</Table.Cell>
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

export default DetalleFactura;
