require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

//middlewares

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
//app.use(bodyParser.json({ limit: "2mb" }));

// routes and middleware
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

// app.get("/app", (req, res, next) => {
//   res.json({ message: "Working" });
// });

const MONGODB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;

mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(PORT, () => {
      console.log(`Api Runing on ${PORT}`);
    });
  }
);
