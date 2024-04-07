import { ApiClient } from "./ApiClient";

export const getAuthToken = (data) => ApiClient.post("/auth/token/", data);

export const getRefreshToken = (data) =>
  ApiClient.post("/auth/token/refresh/", data);

export const getQrCode = () =>
  ApiClient.get("/auth/qr-code/", {
    responseType: "blob",
  });
