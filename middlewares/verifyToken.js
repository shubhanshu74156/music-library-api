const jwtHelper = require('../utils/jwtHelper');
const responseHelper = require('../utils/responseHelper');

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json(responseHelper.generateResponse(401,null,"Unauthorized Access.", null));
  }

  try {
    const decoded = jwtHelper.verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json(responseHelper.generateResponse(401,null,"Invalid or expired token", null));
  }
};

module.exports = verifyTokenMiddleware;
