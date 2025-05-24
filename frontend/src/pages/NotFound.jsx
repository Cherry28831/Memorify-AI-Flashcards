import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn btn-primary">Go to Home</a>
    </div>
  );
};

export default NotFound;