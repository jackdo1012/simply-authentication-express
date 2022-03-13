const AuthController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

const router = require("express").Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/refreshToken", AuthController.refreshToken);

module.exports = router;
