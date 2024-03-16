import { ApiClient } from "./ApiClient";

export const getAuthToken = (data) => ApiClient.post("/auth/token/", data);

export const getRefreshToken = (data) =>
  ApiClient.post("/auth/token/refresh/", data);
