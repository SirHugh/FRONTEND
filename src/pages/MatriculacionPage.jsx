import React from "react";
import QRCode from "qrcode.react";

const MatriculacionPage = () => {
  const url = "http://localhost:5173/multi-step-form-vite-react/";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <h1>Añadir Alumno</h1>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Escanee el siguiente código QR para ebrir el formulario en el teléfono:</p>
        <QRCode value={url} size={200} />
      </div>
    </div>
  );
};

export default MatriculacionPage;
