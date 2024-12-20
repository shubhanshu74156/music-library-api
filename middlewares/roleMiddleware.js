const Roles = require('../constants/roles'); 

const allowAdminAndEditor = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access.",
            error: null
        });
    }

    const userRole = req.user.role;
    if (userRole === Roles.ADMIN || userRole === Roles.EDITOR) {
        return next();
    }

    return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access: You do not have permission to perform this action.",
        error: null
    });
};

const allowAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized Access.",
            error: null
        });
    }

    const userRole = req.user.role;
    if (userRole === Roles.ADMIN) {
        return next();
    }

    return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access: You do not have permission to perform this action.",
        error: null
    });
};

module.exports = {allowAdminAndEditor,allowAdmin};
