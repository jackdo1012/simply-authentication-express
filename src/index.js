const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index.route");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

(async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
    } catch (err) {
        console.error(err);
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
