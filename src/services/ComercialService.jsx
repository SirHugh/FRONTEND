import { ApiClient } from "./ApiClient";

// ---------------------
// servicios para el manejo de control de stock
// ---------------------

export const getControlStock = (id, page) =>
  ApiClient.get(
    `/comercial/stock_control/${id ? id : page ? "?page=" + page : ""}`
  );

export const initiateStockControl = (search, activo, page) =>
  ApiClient.post(
    `/comercial/initiate_stock_control/?tipo=PR${
      search ? "&search=" + search : ""
    }${activo ? "&es_activo=" + activo : ""}`
  );

export const getDetalleStockControl = (id_stockControl) =>
  ApiClient.get(
    `/comercial/detalle_stock_control/${
      id_stockControl ? "?id_stockControl=" + id_stockControl : ""
    }`
  );

export const updateDetalleStockControl = (id, data) =>
  ApiClient.put(`/comercial/detalle_stock_control/${id}`, data);

export const closeControlStock = (id) =>
  ApiClient.get(`/comercial/stock_control/${id}/close`);
