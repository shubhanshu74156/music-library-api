const responseHelper = {
    generateResponse: (statusCode, data = null, message = '', error = null) => {
      return {
        status: statusCode,
        data,
        message,
        error
      };
    }
  };
  
module.exports = responseHelper;
  