const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (userId) {
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() +
            Number(process.env.REFRESH_TOKEN_EXPIRY_TIME_IN_SECONDS),
    );
    let _token = uuidv4();
    let _obj = new this({
        token: _token,
        user: userId,
        expiryDate: expiredAt,
    });
    let refreshToken = await _obj.save();
    return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate > new Date();
};

module.exports = mongoose.model(
    "RefreshToken",
    RefreshTokenSchema,
    "refresh_tokens",
);
