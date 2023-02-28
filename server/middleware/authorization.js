const jwt = require("jsonwebtoken");
require("dotenv").config;

module.exports = async (req, res, next) => {
    try {
        // Step 1: Destructure the token.
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not Authorized.");
        }

        // Step 2: Check if token is valid.
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;

        next();
    } catch (error) {
        console.error(err.message);
        return res.status(403).json("Not Authorized.");
    }
}
