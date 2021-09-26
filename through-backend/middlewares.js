const UserModel = require("./models/User");

const checkIsAdmin = async (req, res, next) => {
    // checkAuthentication must be executed before this method
    // if not req.userId is not defined
    let user = await UserModel.findById(req.userId);

    if (user.role === "admin") {
        // if the user is an admin continue with the execution
        next();
    } else {
        // if the user is no admin return that the user has not the rights for this action
        return res.status(403).send({
            error: "Forbidden",
            message: "You have not the rights for this action.",
        });
    }
};

const checkAuthentication = (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = "";
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
        return res.status(401).send({
            error: "Unauthorized",
            message: "No token provided in the request",
        });

    // verifies secret and checks exp
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: "Unauthorized",
                message: "Failed to authenticate token.",
            });

        // if everything is good, save to request for use in other routes
        req.userId = decoded._id;
        next();
    });
};

module.exports = {
    checkAuthentication,
    checkIsAdmin,
};