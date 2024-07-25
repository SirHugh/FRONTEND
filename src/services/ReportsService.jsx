// ----------------------
// --------- kpi endpoints
// ----------------------

import { ApiClient } from "./ApiClient";

export const getComercialKpi = () => ApiClient.get(`caja/reports/products/`);

export const getCajaKpi = () => ApiClient.get(`caja/reports/flujo-caja/`);

export const getAcademicoKpi = () =>
  ApiClient.get(`academico/reports/matriculas/`);
