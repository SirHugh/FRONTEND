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

export const getArancel = (value, active, page) =>
  ApiClient.get(
    `/caja/arancel/?page=&${page ? page : ""}search=${
      value ? value : ""
    }&es_activo=${active}`
  );

export const createArancel = (data) => ApiClient.post("/caja/arancel/", data);

export const updateArancel = (id, data) =>
  ApiClient.patch(`/caja/arancel/${id}/`, data);
