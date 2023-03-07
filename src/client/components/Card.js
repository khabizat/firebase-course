import React from 'react';

const Card = ({ children }) => (
  <div className="bg-white rounded-lg w-11/12 sm:w-6/12 mx-auto my-4 z-10 px-4 py-5 sm:p-6">
    {children}
  </div>
);

export default Card;
