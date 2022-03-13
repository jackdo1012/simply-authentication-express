const auth = require("./auth.route");

module.exports = function (app) {
    app.use("/api/v1/auth", auth);
};
