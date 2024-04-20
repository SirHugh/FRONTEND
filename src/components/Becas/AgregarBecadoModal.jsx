import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useState } from "react";
import { CgRemove } from "react-icons/cg";
import { GoArrowRight } from "react-icons/go";
import { HiArrowDownTray } from "react-icons/hi2";
import {
  createBecado,
  getBecadosBeca,
  searchMatricula,
} from "../../services/AcademicoService";

const AgregarBecadoModal = ({ show, onClose, beca, changed, setchanged }) => {
  const [alumno, setAlumno] = useState([]);
  const [cedula, setCedula] = useState("");
  const [becadoList, setBecadoList] = useState([]);
  const [isInList, setIsInList] = useState(false);

  const searchAlumno = async (e) => {
    e.preventDefault();
    try {
      const res = await searchMatricula(true, cedula, "");
      setAlumno(res.data);
      console.log("Search: ", res.data);
      const res2 = await getBecadosBeca(
        beca?.id_beca,
        res.data[0].id_matricula
      );
      if (
        becadoList.some(
          (item) => item.id_matricula === res.data[0].id_matricula
        ) ||
        res2.data.count >> 0
      )
        setIsInList(true);
      else setIsInList(false);
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
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
    setCedula("");
  };

  return (
    <>
      <Modal show={show} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header className="p-3">
          {beca?.nombre}: Agregar Alumno
        </Modal.Header>
        <Modal.Body className="py-3 border-t space-y-4">
          <div className="mb-2 block">
            <Label htmlFor="cedula" value="Cedula" />
          </div>
          <div className="flex flex-row gap-1">
            <form
              className="flex flex-row gap-1"
              onSubmit={(e) => searchAlumno(e)}
            >
              <TextInput
                type="search"
                id="searchAlumno"
                name="searchAlumno"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="4375..."
                required
              />
              <Button type="submit">
                <GoArrowRight />
              </Button>
            </form>
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
                onClose();
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
