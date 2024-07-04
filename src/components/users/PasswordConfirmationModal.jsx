// components/PasswordConfirmationModal.js

import React from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";

const PasswordConfirmationModal = ({ isOpen, onClose, onSubmit, passwords, handlePasswordInputChange }) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Confirmar contraseña</Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <TextInput
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Confirmar</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordConfirmationModal;
