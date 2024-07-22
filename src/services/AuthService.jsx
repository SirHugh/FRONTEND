import { ApiClient } from "./ApiClient";

export const getAuthToken = (data) => ApiClient.post("/auth/token/", data);

export const validatePassword = (data) =>
  ApiClient.post("/auth/validate-password/", data);

export const getRefreshToken = (data) =>
  ApiClient.post("/auth/token/refresh/", data);

export const getQrCode = () =>
  ApiClient.get("/auth/qr-code/", {
    responseType: "blob",
  });

export const getUser = (id) => ApiClient.get(`/auth/users/${id ? id`/` : ""}`);

export const getUserData = (id) =>
  ApiClient.get(`/auth/users/${id ? `${id}/` : ""}`);

export const getGroups = (id) =>
  ApiClient.get(`/auth/groups/${id ? id`/` : ""}`);

export const createUser = (data) => ApiClient.post("/auth/users/", data);

export const updateUser = (id, data) =>
  ApiClient.patch(`/auth/users/${id}/`, data);

export const updateUserPhoto = (id, data) =>
  ApiClient.put(`/auth/users/${id}/photo/`, data);

export const updateUserPassword = (id, data) =>
  ApiClient.post(`/auth/users/${id}/password`, data);

export const resetUserPasskey = (id) =>
  ApiClient.post(`/auth/users/${id}/passkey-reset`);
