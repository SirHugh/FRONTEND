import axios from "axios";

export const baseURL = "https://hugoqhomelab.duckdns.org/";

export const ApiClient = axios.create({
  baseURL: baseURL,
});
