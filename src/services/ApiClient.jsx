import axios from "axios";

export const baseURL = "http://192.168.1.139:80/";

export const ApiClient = axios.create({
  baseURL: baseURL,
});
