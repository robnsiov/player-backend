const express = require("express");
const musicRouter = require("./controllers");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

app.use(musicRouter);

app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
