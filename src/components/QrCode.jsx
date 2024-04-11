import { useEffect, useState } from "react";
import { getQrCode } from "../services/AuthService";

const QrCode = () => {
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
    <div className="bg-white">
      <h1>Añadir Alumno</h1>
      {/* <App /> */}
      <div className="p-2">
        <h1>Scanea el codigo QR para acceder al sistema de matriculación.</h1>
        <img src={imgUrl} alt="QR code" />
      </div>
    </div>
  );
};

export default QrCode;
