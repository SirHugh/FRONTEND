import { ApiClient } from "./ApiClient";

// ---------------------
// servicios para el manejo de productos
// ---------------------

export const getProducto = (grado, tipo, page, search, activo) =>
  ApiClient.get(
    `/caja/producto/?tipo=${tipo}${grado ? "&grados=" + grado : ""}${
      page ? "&page=" + page : ""
    }${search ? "&search=" + search : ""}${
      activo ? "&es_activo=" + activo : ""
    }`
  );

export const createProducto = (data) => ApiClient.post(`/caja/producto/`, data);

export const updateProducto = (id, data) =>
  ApiClient.put(`/caja/producto/${id}`, data);

export const createProductoGrado = (data) =>
  ApiClient.post(`/caja/productogrado/`, data);

// ---------------------
// servicios para el manejo de inventario
// ---------------------

export const addAjuste = (data) =>
  ApiClient.post(`/caja/inventario/ajuste/`, data);

export const getAjuste = (page, search) =>
  ApiClient.get(
    `/caja/inventario/ajuste/${page ? "?page=" + page : ""}${
      search ? "&search=" + search : ""
    }`
  );

// ---------------------
// servicios para el manejo de aranceles
// ---------------------

export const getArancel = (active, id_matricula, month, page, search) =>
  ApiClient.get(
    `/caja/arancel/?es_activo=${active}${page ? "&page=" + page : ""}${
      search ? "&search=" + search : ""
    }${id_matricula ? "&id_matricula=" + id_matricula : ""}${
      month ? "&month=" + month : ""
    }`
  );

export const getArancelAlumno = (active, idAlumno, month, page, search) =>
  ApiClient.get(
    `/caja/arancel/?es_activo=${active}${page ? "&page=" + page : ""}${
      search ? "&search=" + search : ""
    }${idAlumno ? "&id_alumno=" + idAlumno : ""}${
      month ? "&month=" + month : ""
    }`
  );

export const createArancel = (data) => ApiClient.post("/caja/arancel/", data);

export const updateArancel = (id, data) =>
  ApiClient.patch(`/caja/arancel/${id}/`, data);

// ---------------------
// servicios para el manejo de clientes
// ---------------------

export const getCliente = (cedula, search, page) => {
  return ApiClient.get(
    `/academico/cliente/?${cedula ? "cedula=" + cedula : ""}${
      search ? "&search=" + search : ""
    }${page ? "&page=" + page : ""}`
  );
};

export const updateCliente = (id, data) => {
  return ApiClient.put(`/academico/cliente/${id}/`, data);
};

// ---------------------
// servicios para el manejo de timbrados
// ---------------------

export const createTimbrado = (data) => {
  return ApiClient.post(`/caja/timbrado/`, data);
};

export const getTimbrado = (id, page) => {
  return ApiClient.get(
    `/caja/timbrado/${id ? id + "/" : ""}${page ? "?page=" + page : ""}`
  );
};

export const updateTimbrado = (id, data) => {
  return ApiClient.patch(`/caja/timbrado/${id}/`, data);
};

export const getActiveTimbrado = () => {
  return ApiClient.get(`/caja/timbrado/?es_activo=true`);
};

// ---------------------
// servicios para el manejo de Factura
// ---------------------

export const createComprobante = (data) => {
  return ApiClient.post(`/caja/comprobante/`, data).then(
    (response) => response.data
  );
};

export const getComprobante = (id, page, search) => {
  return ApiClient.get(
    `/caja/comprobante/${
      id
        ? id
        : `?${page ? "page=" + page : ""}${search ? "&search=" + search : ""}`
    }`
  );
};

// ---------------------
// servicios para el manejo de Factura
// ---------------------

export const createVenta = (data) => {
  return ApiClient.post(`/caja/venta/`, data);
};

export const getVenta = (id, page, search) => {
  return ApiClient.get(
    `/caja/venta/${
      id
        ? id + "/"
        : `?${page ? "page=" + page : ""}${search ? "&search=" + search : ""}`
    }`
  );
};

// ---------------------
// servicios para el manejo de Factura
// ---------------------

export const getPagoVenta = (id, mes, activo) => {
  return ApiClient.get(
    `/caja/venta/pago/?matricula=${id}${mes ? "&mes=" + mes : ""}${
      activo ? "&activo=" + activo : ""
    }`
  );
};

// ---------------------
// servicios para el manejo de flujo de caja
// ---------------------

export const createFlujoCaja = (data) => {
  return ApiClient.post(`/caja/flujo_caja/`, data);
};

export const setFlujoCajaActive = (id, value) => {
  return ApiClient.patch(`/caja/flujo_caja/${id}`, { es_activo: value });
};

export const getFlujoCajaCurrent = (value) => {
  return ApiClient.get(`/caja/flujo_caja/?current=${value}`);
};

export const getFlujoCaja = (id, page, fecha) => {
  return ApiClient.get(
    `/caja/flujo_caja/${
      id
        ? id + "/"
        : page
        ? "?page=" + page + `${fecha ? "&fecha=" + fecha : ""}`
        : ""
    }`
  );
};

// ---------------------
// servicios para el manejo de Compras
// ---------------------

export const createCompra = (data) => {
  return ApiClient.post(`/caja/compra/`, data);
};

export const getCompra = (id, page, search) => {
  return ApiClient.get(
    `/caja/compra/${
      id
        ? id + "/"
        : `?${page ? "page=" + page : ""}${search ? "&search=" + search : ""}`
    }`
  );
};

// ---------------------
// servicios para el manejo de tipos de actividades
// ---------------------

export const getTipoActividad = (page, search) => {
  return ApiClient.get(
    `caja/actividad/tipo/${page ? "?page=" + page : ""}${
      search ? "&search=" + search : ""
    }`
  );
};

export const createTipoActividad = (data) => {
  return ApiClient.post(`caja/actividad/tipo/`, data);
};

export const updateTipoActividad = (id, data) => {
  return ApiClient.put(`caja/actividad/tipo/${id}`, data);
};

// ---------------------
// servicios para el manejo de actividades
// ---------------------

export const createActividad = (data) => {
  return ApiClient.post(`/caja/actividad/`, data);
};

export const getPagoPendienteActividad = (id_matricula) => {
  return ApiClient.get(
    `/caja/actividad/pago/pendiente/?id_matricula=${id_matricula}`
  );
};

export const getActividades = (id, id_grado, id_perido, search, page) => {
  const params = new URLSearchParams();

  if (id_grado !== "") params.append("id_grado", id_grado);
  if (id_perido !== "") params.append("id_perido", id_perido);
  if (search !== "") params.append("search", search);
  if (page !== "") params.append("page", page);

  const url = `/caja/actividad/${id ? id : "?" + params.toString()}`;

  return ApiClient.get(url);
};

export const activateActividad = (id_actividad, value) => {
  return ApiClient.patch(`/caja/actividad/${id_actividad}`, {
    es_activo: value,
  });
};

// ---------------------
// servicios de forma de pago
// ---------------------

export const getFormaPago = () => {
  return ApiClient.get(`/caja/forma_pago/`);
};

// ---------------------
// enviar email al cliente
// ---------------------

export const sendEmailFactura = (data) => {
  return ApiClient.post(`/caja/send_email/`, data);
};
