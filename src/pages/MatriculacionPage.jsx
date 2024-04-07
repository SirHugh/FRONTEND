import React, { useEffect, useState } from "react";
import App from "../../multi-step-form-inscription/src/App";
import { getQrCode } from "../services/AuthService";

const MatriculacionPage = () => {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    let getCode = async () => {
      let res = await getQrCode();

      const blob = await res.data;
      const objectUrl = URL.createObjectURL(blob);
      console.log(objectUrl);
      if (res.status === 200) {
        return setImgUrl(objectUrl);
      }
    };
    getCode();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <h1>Añadir Alumno</h1>
      {/* <App /> */}
      <div className="App">
        <h1>Scan the QR code to access the form</h1>
        <img src={imgUrl} alt="QR code" />
      </div>
    </div>
  );
};

export default MatriculacionPage;
