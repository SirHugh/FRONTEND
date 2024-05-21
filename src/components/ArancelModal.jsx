// ArancelModal.jsx
import React from "react";
import { Modal } from "flowbite-react";
import ArancelForm from "./ArancelForm";

const ArancelModal = ({ arancel, onSave, onClose }) => {
  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>
        {arancel ? "Editar Arancel" : "Agregar Arancel"}
      </Modal.Header>
      <Modal.Body>
        <ArancelForm arancel={arancel} onSave={onSave} />
      </Modal.Body>
    </Modal>
  );
};

export default ArancelModal;
