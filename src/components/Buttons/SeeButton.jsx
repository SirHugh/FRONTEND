import React from 'react';
import icon from '../../assets/icons/SeeIcon.svg';
export const SeeButton = ({ onClick }) => {
  return(
    <button onClick={onClick} className="text-indigo-600 hover:text-indigo-900">
      <img src={icon} className="h-5 w-5 inline-block" title="Ver" />
      <span className="ml-1"></span>
    </button>
);
}
export default SeeButton;