const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary")
const dotenv = require("dotenv")

const userRouter = require("./routes/userRoute");
const courseRouter = require("./routes/courseRoute")

const app = express();

PORT = process.env.PORT || 8000;

require("./config/db");
dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

cloudinary.v2.config({
    cloud_name: "dtqgrxdge",
    api_key: "911219321439766",
    api_secret: "wCk5zu2uLH_sWYn1AROnpPByb7A"
})

app.use("/api/v1", userRouter)
app.use("/api/v1", courseRouter)

app.listen(PORT, () => {
    console.log("app is working")
})