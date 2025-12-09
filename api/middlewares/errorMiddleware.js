const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof Error && err.message.includes('File too large')) {
      return res.status(413).json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  module.exports = errorHandler;