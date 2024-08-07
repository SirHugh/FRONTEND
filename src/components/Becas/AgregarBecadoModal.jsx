import { Button, Label, Modal, Table } from "flowbite-react";
import AsyncSelect from "react-select/async";
import { useState } from "react";
import { CgRemove } from "react-icons/cg";
import { HiArrowDownTray } from "react-icons/hi2";
import {
  createBecado,
  getBecadosBeca,
  searchMatricula,
} from "../../services/AcademicoService";
import toast from "react-hot-toast";

const AgregarBecadoModal = ({ show, onClose, beca, changed, setChanged }) => {
  const [alumno, setAlumno] = useState([]);
  const [becadoList, setBecadoList] = useState([]);
  const [isInList, setIsInList] = useState(false);
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  const loadOptions = async () => {
    if (inputValue.length < 2) return;
    return searchMatricula(true, inputValue, 1).then((result) => {
      const res = result.data.results;
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = async (value) => {
    setSelecteValue(value);
    const valueExist = becadoList.filter(
      (s) => s.id_matricula == value.id_matricula
    );
    console.log(valueExist);
    if (valueExist.length > 0) {
      return;
    }
    const res2 = await getBecadosBeca(beca?.id_beca, value.id_matricula);
    console.log("REs", res2.data);
    if (
      becadoList.some((item) => item.id_matricula === value.id_matricula) ||
      res2.data[0]
    ) {
      toast.error("El alumno ya cuenta con esta beca!");
      return;
    } else setIsInList(false);
    setAlumno([...alumno, value]);
    console.log("Alumno: ", value);
  };

  const agregarBecado = async (data) => {
    try {
      const res = await createBecado(data);
      if (res.status === 200) {
        console.log("data: ", res.data);
      }
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
    setChanged(!changed);
  };

  const agregarBecados = () => {
    becadoList.forEach((b) => {
      const data = {
        id_matricula: b.id_matricula,
        es_activo: true,
        fecha_inicio: new Date().toJSON().slice(0, 10),
        fecha_fin: null,
        id_beca: beca.id_beca,
      };
      agregarBecado(data);
    });
  };

  const onCloseModal = () => {
    onClose();
    setAlumno([]);
    setBecadoList([]);
    setValue("");
    setSelecteValue(null);
  };

  return (
    <>
      <Modal show={show} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header className="p-3">
          {beca?.nombre}: Agregar Alumno
        </Modal.Header>
        <Modal.Body className="py-3 border-t space-y-4">
          <div className="mb-2 block">
            <Label htmlFor="cedula" value="Buscar alumno:" />
          </div>
          <div className="flex flex-row gap-1">
            <div className="flex flex-col w-72">
              <AsyncSelect
                noOptionsMessage={() => "No se encuentran resultados"}
                placeholder="Nombre, apellido, cedula..."
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
            </div>
          </div>
          <div className="flex flex-row gap-1 h-10">
            <Table>
              <Table.Head></Table.Head>
              <Table.Body>
                {alumno.map((a) => (
                  <Table.Row key={a.id_matricula}>
                    <Table.Cell>{a.id_alumno.cedula}</Table.Cell>
                    <Table.Cell>{a.id_alumno.nombre}</Table.Cell>
                    <Table.Cell>{a.id_alumno.apellido}</Table.Cell>
                    <Table.Cell>
                      {a.id_grado.grado}° - {a.id_grado.nombre}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={(e) => {
                          isInList
                            ? e.preventDefault
                            : (setBecadoList((becadoList) => [
                                ...becadoList,
                                a,
                              ]),
                              setAlumno([]));
                        }}
                        className={`flex flex-row items-center p-2 gap-2 font-medium ${
                          isInList
                            ? "text-red-700 cursor-not-allowed "
                            : "text-cyan-600 hover:underline cursor-pointer "
                        }`}
                      >
                        <HiArrowDownTray
                          title="Remover Beca"
                          className="size-6"
                        />
                        <p>Agregar a la lista</p>
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div>
            <Table>
              <Table.Head>
                <Table.HeadCell>Cedula</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Apellido</Table.HeadCell>
                <Table.HeadCell>Grado</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {becadoList.map((b) => (
                  <Table.Row key={b.id_matricula}>
                    <Table.Cell>{b.id_alumno.cedula}</Table.Cell>
                    <Table.Cell>{b.id_alumno.nombre}</Table.Cell>
                    <Table.Cell>{b.id_alumno.apellido}</Table.Cell>
                    <Table.Cell>
                      {b.id_grado.grado}° - {b.id_grado.nombre}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => {
                          setBecadoList(
                            becadoList.filter(
                              (item) => item.id_matricula !== b.id_matricula
                            )
                          );
                          setAlumno([]);
                        }}
                        className="flex flex-row items-center p-2 gap-2 font-medium text-red-700 hover:underline dark:text-cyan-500 cursor-pointer"
                      >
                        <CgRemove title="Remover Beca" className="size-6" />
                        <p>Quitar de la lista</p>
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button
            disabled={becadoList.length == 0 ? true : false}
            onClick={() => {
              if (window.confirm("Confirma Guardar?")) {
                agregarBecados();
                onCloseModal();
              }
            }}
          >
            Guardar Becados
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgregarBecadoModal;
