import { ApiClient } from "./ApiClient";

export const getBasicInfo = () => ApiClient.get(`/basics/organization/`);

export const updateBasicInfo = (data) =>
  ApiClient.put(`/basics/organization/`, data);
