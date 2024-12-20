const validateFields = (requiredFields, requestBody) => {
    for (let field of requiredFields) {
      if (!requestBody[field]) {
        return {
          status: 400,
          message: `Bad Request, Reason: Missing Field (${field})`
        };
      }
    }
    return null;
  };
  
  module.exports = validateFields;
  