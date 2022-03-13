const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error();
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed",
        });
    }
};

module.exports = verifyToken;
