import { ApiClient } from "./ApiClient";

// ---------------------
// servicios para el manejo de productos
// ---------------------

export const getProducto = (grado, tipo) =>
  ApiClient.get(
    `/caja/producto/?tipo=${tipo}${grado ? "&grados=" + grado : ""}`
  );

export const createProducto = (data) => ApiClient.post(`/caja/producto/`, data);

export const updateProducto = (id, data) =>
  ApiClient.patch(`/caja/producto/${id}/`, data);

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

export const createArancel = (data) => ApiClient.post("/caja/arancel/", data);

export const updateArancel = (id, data) =>
  ApiClient.patch(`/caja/arancel/${id}/`, data);

// ---------------------
// servicios para el manejo de clientes
// ---------------------

export const getCliente = (cedula) => {
  return ApiClient.get(`/academico/cliente/?cedula=${cedula}`);
};

// ---------------------
// servicios para el manejo de timbrados
// ---------------------

export const createTimbrado = (data) => {
  return ApiClient.post(`/caja/timbrado/`, data);
};

export const getTimbrado = (page, id) => {
  return ApiClient.get(
    `/caja/timbrado/${id ? id + "/" : ""}${page ? "?page=" + page : ""}`
  );
};

export const updateTimbrado = (id, data) => {
  return ApiClient.patch(`/caja/timbrado/${id}/`, data);
};
