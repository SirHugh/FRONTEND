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

export const getResponsables = (id_alumno) =>
  ApiClient.get(
    `/academico/responsable/?${id_alumno ? "id_alumno=" + id_alumno : ""}`
  );

export const searchResponsables = (page, searchTerm) => {
  return ApiClient.get(
    `/academico/responsable/?page=${page}&search=${searchTerm}`
  );
};

export const updateResponsable = (id, data) =>
  ApiClient.put(`/academico/responsable/${id}/`, data);

//  funciones para manejo de los grados

export const getGrados = (es_activo) =>
  ApiClient.get(
    `/academico/grados/${es_activo ? "?es_activo=" + es_activo : ""}`
  );

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

export const getMatriculasAlumnoId = (periodo, id, page) =>
  ApiClient.get(
    `/academico/matricula/?anio_lectivo=${periodo}&id_alumno=${id}&page=${
      page ? page : ""
    }`
  );

export const searchMatricula = (value, data, page, anio) =>
  ApiClient.get(
    `/academico/matricula/?es_activo=${value}&search=${data}&page=${
      page ? page : ""
    }&anio_lectivo=${anio ? anio : ""}`
  );

export const setMatriculaActive = (id, value, date) =>
  ApiClient.patch(`/academico/matricula/${id}/`, {
    es_activo: value,
    fecha_desmatriculacion: date,
  });

export const updateMatricula = (id, data) =>
  ApiClient.put(`/academico/matricula/${id}/`, data);

export const getMatriculaResposable = (id) =>
  ApiClient.get(`/academico/matricula/responsable/${id}/`);

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

export const getBecados = (page, seach) =>
  ApiClient.get(`/academico/becado/?page=${page}`);

export const getBecadosBeca = (id_beca, id_matricula, page) =>
  ApiClient.get(
    `/academico/becado/?${id_beca ? `id_beca=${id_beca}` : ""}${
      id_matricula ? `&id_matricula=${id_matricula}` : ""
    }${page ? "&page=" + page : ""}`
  );

export const searchBecado = (value, page) =>
  ApiClient.get(`/academico/becado/?search=${value}&page=${page}`);

export const createBecado = (data) =>
  ApiClient.post(`/academico/becado/`, data);

export const setActiveBecado = (id, value, date) =>
  ApiClient.patch(`/academico/becado/${id}/`, {
    es_activo: value,
    fecha_fin: date,
  });

export const getBecaMatricula = (id_matricula) =>
  ApiClient.get(`/academico/becado/matricula/${id_matricula}/`);

// ------------------------------------------------
// ---funciones para manejo de periodo academico---
// ------------------------------------------------

export const createPeriodo = (data) =>
  ApiClient.post(`/academico/periodo/`, data);

export const updatePeriodo = (id, data) =>
  ApiClient.patch(`/academico/periodo/${id}/`, data);

export const getPeriodo = (value, page) =>
  ApiClient.get(
    `/academico/periodo/?${value ? "es_activo=" + value : ""}${
      page ? "page=" + page : ""
    }`
  );

// ------------------------------------------------
// ---funciones para manejo Estado de cuenta---
// ------------------------------------------------

export const getEstadoDeCuenta = (id_matricula) =>
  ApiClient.get(`/caja/estado_cuenta/${id_matricula}`);
