import { ApiClient } from "./ApiClient";

export const getAlumnos = () => ApiClient.get("/academico/alumnos/");

export const getAlumnoById = (id) => ApiClient.get(`/academico/alumnos/${id}`);

export const createAlumno = (data) =>
  ApiClient.post(`/academico/alumnos/`, data);

export const updateAlumno = (id, data) =>
  ApiClient.put(`/academico/alumnos/${id}`, data);

export const deleteAlumno = (id) =>
  ApiClient.delete(`/academico/alumnos/${id}`);

// path('grados/', views.grado_list),
// path('grados/<int:pk>/', views. grado_detail),
// path('matricula/', views.matricula_list),
// path('matricula/<int:pk>/', views.matricula_detail),
// path('beca/', views.beca_list),
// path('beca/<int:pk>/', views.beca_detail),
// path('becado/', becadoListCreateView.as_view(), name='becado-list-create'),
// path('becado/<int:pk>/', BecadoDetailView.as_view(), name='becado-detalle'),
// path('becado/beca/<int:pk>/', views.becado_detail),
// path('cliente/', ClienteListCreateView.as_view()),
// path('cliente/<int:pk>/', ClienteDetailView.as_view()),
// path('responsable/', views.responsable_list),
// path('responsable/<int:pk>/', views.responsable_detail),
