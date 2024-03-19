import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ icon, title, linkTo }) => {
  return (
    <Link to={linkTo} className="no-underline">
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center cursor-pointer">
        <img src={icon} alt={title} className="w-20 h-40 mr-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </Link>
  );
};

export default Card;
