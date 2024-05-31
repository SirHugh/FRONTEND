import React from 'react';
import GradoForm from './GradoForm';

function EditGradoForm({ onClose, initialData, onUpdateGrado }) {
  const handleUpdate = (id, data) => {
    onUpdateGrado(id, data);
    onClose();
  };

  return (
    <GradoForm
      onClose={onClose}
      initialData={initialData}
      isEdit={true}
      onSubmit={handleUpdate}
    />
  );
}

export default EditGradoForm;
