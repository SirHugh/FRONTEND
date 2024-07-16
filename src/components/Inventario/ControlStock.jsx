import { useCallback, useEffect, useRef, useState } from "react";
import toast, { CheckmarkIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  closeControlStock,
  getControlStock,
} from "../../services/ComercialService";
import { Button, Label, Spinner, Table, TextInput } from "flowbite-react";
import axios from "axios";

function ControlStock() {
  const { id } = useParams();
  const [controlStock, setControlStock] = useState([]);
  const [detalleContol, setDetalleControl] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const inputRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [detalleUpdate, setDetalleUpdate] = useState();
  const [savingStates, setSavingStates] = useState([]);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadControl = async () => {
      try {
        const res = await getControlStock(id);
        setControlStock(res.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadControl();
  }, [reload]);

  const lastProductElementReff = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios({
      method: "GET",
      url: `http://localhost:8000/comercial/detalle_stock_control/`,
      params: { id_controlStock: id, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res.data.results);
        setDetalleControl((prevDetalle) => {
          return [...new Set([...prevDetalle, ...res.data.results])];
        });
        setSavingStates((prevSavinStates) => {
          return [
            ...prevSavinStates,
            ...res.data.results.map(() => ({ saving: false, saved: false })),
          ];
        });
        setHasMore(res.data.next !== null);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        toast.error(error.message);
      });
    return () => cancel();
  }, [pageNumber]);

  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);

  const handleEditClick = () => {
    setEdit(true);
  };
  const handleInputChange = (event, index) => {
    const values = [...detalleContol];
    setUpdatingIndex(index);
    values[index][event.target.name] = event.target.value;
    setDetalleControl(values);
    setDetalleUpdate(values[index]);
  };

  useEffect(() => {
    if (!detalleUpdate) return;
    const delay = 500;
    setSavingStates((prevStates) => {
      prevStates[updatingIndex] = { saving: true, saved: false };
      return [...prevStates];
    });
    const source = axios.CancelToken.source();
    const delayedRequest = setTimeout(() => {
      axios({
        method: "PATCH",
        url: `http://localhost:8000/comercial/detalle_stock_control/${detalleUpdate.id_detalleControl}`,
        data: { cantidad_contada: detalleUpdate.cantidad_contada },
        cancelToken: source.token,
      })
        .then((res) => {
          console.log(res.data);
          setSavingStates((prevStates) => {
            prevStates[updatingIndex] = { saving: false, saved: true };
            return [...prevStates];
          });
        })
        .catch((error) => {
          if (axios.isCancel(error)) return;
          toast.error(error.message);
          console.log(error);
        });
    }, delay);
    return () => {
      clearTimeout(delayedRequest);
      source.cancel();
    };
  }, [detalleContol]);

  const handleCloseControl = async () => {
    setEdit(false);
    if (
      !window.confirm(
        "Confirma que desea cerrar el Control de Stock.\nEsto impactara en la cantidad de stock"
      )
    )
      return;
    try {
      await closeControlStock(controlStock.id_controlStock);
      setReload(!reload);
      toast.success("Control cerrado Exitosamente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center py-5">
      <div className="flex flex-col w-4/5 border rounded-lg p-5 gap-3 justify-center">
        <big className="flex justify-center text-3xl font-bold">
          Control de Stock
        </big>
        <div className="flex flex-col gap-3 text-xl">
          <div className="grid grid-cols-3 border rounded-lg p-3">
            <div>
              <Label>Nro. Control:</Label>
              <p>{controlStock.id_controlStock}</p>
            </div>
            <div>
              <Label>Fecha</Label>
              <p>{controlStock.fecha}</p>
            </div>
            <div>
              <Label>Usuario</Label>
              <p>{controlStock.usuario}</p>
            </div>
            <div>
              <Label>Estado</Label>
              <p>{controlStock.es_activo ? "Abierto" : "Cerrado"}</p>
            </div>
            <div>
              <Label>Cant. Productos</Label>
              <p>{controlStock.cantidad_productos}</p>
            </div>
          </div>

          {controlStock.es_activo ? (
            <div className="flex flex-row justify-end gap-3">
              <Button color="dark" onClick={handleEditClick}>
                Cargar
              </Button>
              <Button color="dark" onClick={handleCloseControl}>
                Finalizar Control
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <big className="flex justify-center text-xl font-bold">Detalle </big>
          <Table
            className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray
          -500"
          >
            <Table.Head
              className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-
            700 dark:text-gray-400"
            >
              <Table.HeadCell className="px-6 py-3">N°</Table.HeadCell>
              <Table.HeadCell className="px-6 py-3">Codigo</Table.HeadCell>
              <Table.HeadCell className="px-6 py-3">Articulo</Table.HeadCell>
              {!controlStock.es_activo ? (
                <Table.HeadCell className="px-6 py-3">Stock</Table.HeadCell>
              ) : (
                ""
              )}
              <Table.HeadCell className="px-6 py-3">
                Cantidad Contada
              </Table.HeadCell>
              {controlStock.es_activo ? (
                <Table.HeadCell className="px-6 py-3"></Table.HeadCell>
              ) : (
                <Table.HeadCell className="px-6 py-3">
                  Diferencia
                </Table.HeadCell>
              )}
            </Table.Head>
            <Table.Body
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700
            "
            >
              {loading && "Cargando..."}
              {detalleContol &&
                detalleContol.map((item, index) => (
                  <Table.Row
                    ref={
                      detalleContol.length === index + 1
                        ? lastProductElementReff
                        : null
                    }
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-
                    700"
                    key={item.id_detalleControl}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{item.id_producto}</Table.Cell>
                    <Table.Cell>{item.producto}</Table.Cell>
                    {!controlStock.es_activo ? (
                      <Table.Cell>{item.stock}</Table.Cell>
                    ) : (
                      ""
                    )}
                    <Table.Cell>
                      {controlStock.es_activo ? (
                        <TextInput
                          ref={index === 0 ? inputRef : null}
                          disabled={!edit}
                          type="number"
                          min={0}
                          value={item.cantidad_contada}
                          name="cantidad_contada"
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      ) : (
                        item.cantidad_contada
                      )}
                    </Table.Cell>
                    {controlStock.es_activo ? (
                      <Table.Cell>
                        {savingStates[index].saving && <Spinner />}
                        {savingStates[index].saved && <CheckmarkIcon />}
                      </Table.Cell>
                    ) : (
                      <Table.Cell>
                        {item.cantidad_contada - item.stock}
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ControlStock;
