const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: [true, "Email is already in use"],
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("User", UsersSchema, "users");
