import React from 'react';
import icon from '../../assets/icons/DeleteIcon.svg';
const DeleteButton = ({ onClick }) => {
  return(
    <button onClick={onClick} className="text-red-600 hover:text-red-900">
      <img src ={icon} className="h-5 w-5 inline-block" title="Eliminar" />
      <span className="ml-1"></span>
    </button>
  );
  };

export default DeleteButton;