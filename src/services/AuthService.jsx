import { ApiClient } from "./ApiClient";

export const getAuthToken = (data) => ApiClient.post("/auth/token/", data);

export const getRefreshToken = (data) =>
  ApiClient.post("/auth/token/refresh/", data);

export const getQrCode = () =>
  ApiClient.get("/auth/qr-code/", {
    responseType: "blob",
  });

export const getUser = (id) => ApiClient.get(`/auth/users/${id ? id`/` : ""}`);

export const getGroups = (id) =>
  ApiClient.get(`/auth/groups/${id ? id`/` : ""}`);

export const createUser = (data) => ApiClient.post("/auth/users/", data);
