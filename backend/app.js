// || ---- Run "npm start" to start the local server on localhost:5000
import * as dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import rideRoutes from "./router/rides.js";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/rides", rideRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server successfully started on port ${PORT} & DB connected`));
  })
  .catch((err) => console.log(err));
