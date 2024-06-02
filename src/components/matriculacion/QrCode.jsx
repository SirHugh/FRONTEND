import { useEffect, useState } from "react";
import { getQrCode } from "../../services/AuthService";
import { Modal } from "flowbite-react";

const QrCode = ({ show, onClose }) => {
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
    <Modal show={show} onClose={onClose} size="md" popup>
      <Modal.Header>
        <h1>Inscripcion Movil</h1>
      </Modal.Header>
      <Modal.Body>
        <div className="p-2">
          <h1>Scanea el codigo QR para acceder al sistema de matriculación.</h1>
          <img src={imgUrl} alt="QR code" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QrCode;
