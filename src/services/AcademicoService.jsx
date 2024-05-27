import { ApiClient } from "./ApiClient";

//funciones para el manejo de la API de alumnos

export const getAlumnos = (page) =>
  ApiClient.get(`/academico/alumnos/?page=${page ? page : ""}`);

export const searchAlumnos = (page, searchTerm) => {
  return ApiClient.get(
    `/academico/alumnos/?page=${page ? page : ""}&search=${searchTerm}`
  );
};

export const getAlumnoById = (id) => {
  return ApiClient.get(`/academico/alumnos/${id}`);
};

export const createAlumno = (data) => {
  return ApiClient.post("/academico/alumnos/", data);
};

export const updateAlumno = (id, data) =>
  ApiClient.put(`/academico/alumnos/${id}/`, data);

export const deleteAlumno = (id) =>
  ApiClient.delete(`/academico/alumnos/${id}`);

//funciones para el manejo de la API de responsables

export const createResponsables = (data) =>
  ApiClient.post("/academico/responsable/", data);

export const getResponsables = () => ApiClient.get("/academico/responsable/");

export const updateResponsable = (id, data) =>
  ApiClient.put(`/academico/responsable/${id}/`, data);

//  funciones para manejo de los grados

export const getGrados = () => ApiClient.get("/academico/grados/");

export const getGradoById = (id) => ApiClient.post(`/academico/grados/${id}`);

export const createGrado = (data) => ApiClient.post("/academico/grados/", data);

export const updateGrado = (id, data) =>
  ApiClient.put(`/academico/grados/${id}/`, data);

export const setGradoActive = (id, value) =>
  ApiClient.patch(`/academico/grados/${id}/`, { es_activo: value });

// -----------------------------------------
// ---funciones para manejo de matriculas---
// -----------------------------------------

export const getMatricula = (anio, grado, search, page) =>
  ApiClient.get(
    `/academico/matricula/?anio_lectivo=${anio}&id_grado=${grado}&search=${search}&page=${
      page ? page : ""
    }`
  );

export const searchMatricula = (value, data, page) =>
  ApiClient.get(
    `/academico/matricula/?es_activo=${value}&search=${data}&page=${
      page ? page : ""
    }`
  );

export const setMatriculaActive = (id, value, date) =>
  ApiClient.patch(`/academico/matricula/${id}/`, {
    es_activo: value,
    fecha_desmatriculacion: date,
  });

export const updateMatricula = (id, data) =>
  ApiClient.put(`/academico/matricula/${id}/`, data);

// ------------------------------------
// ---funciones para manejo de becas---
// ------------------------------------

export const getBecas = () => ApiClient.get(`/academico/beca/`);

export const updateBeca = (id, data) =>
  ApiClient.put(`/academico/beca/${id}/`, data);

export const createBeca = (data) => ApiClient.post(`/academico/beca/`, data);

export const setBecaActive = (id, value) =>
  ApiClient.patch(`/academico/beca/${id}/`, { es_activo: value });

// --------------------------------------
// ---funciones para manejo de becados---
// --------------------------------------

export const getBecados = (page) =>
  ApiClient.get(`/academico/becado/?page=${page}`);

export const getBecadosBeca = (id, matricula) =>
  ApiClient.get(
    `/academico/becado/?id_beca=${id}&id_matricula=${
      matricula ? matricula : ""
    }`
  );

export const searchBecado = (value) =>
  ApiClient.get(`/academico/becado/?search=${value}`);

export const createBecado = (data) =>
  ApiClient.post(`/academico/becado/`, data);

export const setActiveBecado = (id, value, date) =>
  ApiClient.patch(`/academico/becado/${id}/`, {
    es_activo: value,
    fecha_fin: date,
  });

// ------------------------------------------------
// ---funciones para manejo de periodo academico---
// ------------------------------------------------

export const createPeriodo = (data) =>
  ApiClient.post(`/academico/periodo/`, data);

export const updatePeriodo = (id, data) =>
  ApiClient.patch(`/academico/periodo/${id}/`, data);

export const getPeriodo = (value) =>
  ApiClient.get(`/academico/periodo/${value ? "?es_activo=" + value : ""}`);
