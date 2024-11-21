const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();

mongoose
  .connect(process.env.MONGO_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected ");
  })
  .catch((err) => {
    console.log("Getting Error", err);
  });
