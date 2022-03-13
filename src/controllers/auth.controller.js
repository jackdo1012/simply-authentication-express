const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { returnServerErr } = require("../utils/constants");
const User = require("../models/Users.model");
const RefreshToken = require("../models/RefreshToken.model");
const {
    createAccessAndRefreshTokens,
    createAccessToken,
    verifyExpiration,
} = require("../services/auth.service");
const RefreshTokenModel = require("../models/RefreshToken.model");

class AuthController {
    async signup(req, res) {
        try {
            const { fullName, email, password } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Full name, email and password are required",
                });
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                fullName,
                email,
                password: hashPassword,
            });
            await newUser.save();
            const { accessToken, refreshToken } =
                await createAccessAndRefreshTokens(newUser._id);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                accessToken,
                refreshToken,
            });
        } catch (err) {
            return returnServerErr(res, err);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required",
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid password or email",
                });
            }

            const passwordValidation = await bcrypt.compare(
                password,
                user.password,
            );
            if (!passwordValidation) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password or email",
                });
            }
            const { accessToken, refreshToken } =
                await createAccessAndRefreshTokens(user._id);
            return res.json({
                success: true,
                message: "User logged in successfully",
                accessToken,
                refreshToken,
                user: {
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        } catch (err) {
            return returnServerErr(res, err);
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required",
                });
            }
            const refreshTokenData = await RefreshToken.findOne({
                refreshToken,
            }).populate("user");

            if (!refreshTokenData) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }
            const refreshTokenVerification = verifyExpiration(refreshTokenData);
            if (!refreshTokenVerification) {
                await RefreshToken.findOneAndDelete({ token: refreshToken });
                return res.status(401).json({
                    success: false,
                    message: "Refresh token expired",
                });
            }
            const accessToken = await createAccessToken(
                refreshTokenData.user._id,
            );
            return res.json({
                success: true,
                accessToken,
                refreshToken,
            });
        } catch (err) {
            return returnServerErr(res, err);
        }
    }
}

module.exports = new AuthController();
