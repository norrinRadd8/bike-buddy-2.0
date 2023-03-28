// || ---- Run "npm start" to start the local server on localhost:5000

const express = require("express");
// const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 5000;

app.get("/", (req, res) => {
  res.send(`Server successfully started on port ${PORT}`).status(200);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
