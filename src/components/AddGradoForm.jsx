import React from 'react';
import GradoForm from './GradoForm';

function AddGradoForm({ onClose }) {
  return <GradoForm onClose={onClose} isEdit={false} />;
}

export default AddGradoForm;
