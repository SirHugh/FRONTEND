import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ icon, title, linkTo }) => {
  return (
    <Link to={linkTo} className="block">
      <div className="flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-sm h-32 text-center">
        <img src={icon} alt={title} className="h-10 w-10 mb-2" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
    </Link>
  );
};

export default Card;
