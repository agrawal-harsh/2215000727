import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-center py-10">
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm mt-2">Please try again later</p>
  </div>
);

export default ErrorMessage;
