import { useNavigate } from "react-router-dom";

export default function TaskCard({ alumno }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ background: "blue" }}
      onClick={() => {
        // navigate(`/tasks/${alumno.id}`);
      }}
    >
      <h1>{alumno.nombre}</h1>
      <p>{JSON.stringify(alumno)}</p>
      <hr />
    </div>
  );
}
