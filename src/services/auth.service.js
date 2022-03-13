const jwt = require("jsonwebtoken");

const createAccessToken = async function (userId) {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    return accessToken;
};

exports.createAccessToken = createAccessToken;

const createToken = async function (userId) {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() +
            Number(process.env.REFRESH_TOKEN_EXPIRY_TIME_IN_SECONDS),
    );
    const token = uuidv4();
    const obj = new RefreshTokenModel({
        token: token,
        user: userId,
        expiryDate: expiredAt,
    });
    const refreshToken = await obj.save();
    return refreshToken.token;
};
exports.createToken = createToken;

exports.createAccessAndRefreshTokens = async function (userId) {
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createToken(userId);
    return {
        accessToken,
        refreshToken,
    };
};

exports.verifyExpiration = (token) => {
    return token.expiryDate > new Date();
};
