import React, { useEffect, useState } from "react";
import { getResponsables } from "../services/AcademicoService";
import { Table } from "flowbite-react";
import { BiEdit } from "react-icons/bi";

const ResponsablesList = () => {
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const res = await getResponsables();
        setResponsables(res.data);
      } catch (error) {
        console.error("Error al obtener los responsables:", error);
      }
    };
    fetchResponsables();
  }, []);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <h1 className="">RESPONSABLES</h1>
      </div>
      <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Cliente</Table.HeadCell>
            <Table.HeadCell>Alumno</Table.HeadCell>
            <Table.HeadCell>Ocupación</Table.HeadCell>
            <Table.HeadCell>Tipo de Relación</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {responsables.map((responsable) => (
              <Table.Row
                key={responsable.id_responsable}
                className="hover:border-l-blue-500 hover:border-l-4"
              >
                <Table.Cell>{responsable.id_responsable}</Table.Cell>
                <Table.Cell>{responsable.id_cliente}</Table.Cell>
                <Table.Cell>{responsable.id_alumno}</Table.Cell>
                <Table.Cell>{responsable.ocupacion}</Table.Cell>
                <Table.Cell>{responsable.tipo_relacion}</Table.Cell>
                <Table.Cell>
                  <BiEdit className="text-2xl" title="Editar" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ResponsablesList;
