const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

//db
mongoose.connect(process.env.MONGO_DB);

//db connection
let db = mongoose.connection;
db.on("error", () => console.error("Error! Failed to connect to MongoDB"));
db.once("open", () => console.log("Connected to MongoDB!"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routing
//user route
const userRoutes = require("./routes/User");
app.use("/users", userRoutes);

//post route
const postRoutes = require("./routes/Post");
app.use("/blogs", postRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${process.env.PORT || 4000}`);
  });
}

module.exports = { app, mongoose };
