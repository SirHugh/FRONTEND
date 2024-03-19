import React from 'react';
import icon from '../../assets/icons/EditIcon.svg';

const EditButton = ({ onClick }) => {
  return(
    <button onClick={onClick} className="text-indigo-600 hover:text-indigo-900">
      <img src ={icon} className="h-5 w-5 inline-block" title="Editar" />
      <span className="ml-1"></span>
    </button>
  );
};

export default EditButton;