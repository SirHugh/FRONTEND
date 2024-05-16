import { ApiClient } from "./ApiClient";

export const getProducto = (grado, tipo) =>
  ApiClient.get(`/caja/producto/?grados=${grado}&tipo=${tipo}`);

export const createProducto = (data) => ApiClient.post(`/caja/producto/`, data);

export const updateProducto = (id, data) =>
  ApiClient.put(`/caja/producto/${id}/`, data);

// ---------------------
// servicios para el manejo de aranceles
// ---------------------

export const getArancel = (value, active, page) =>
  ApiClient.get(
    `/caja/arancel/?page=&${page ? page : ""}search=${
      value ? value : ""
    }&es_activo=${active}`
  );

export const agregarArancel = (data) => ApiClient.post("/caja/arancel/", data);
