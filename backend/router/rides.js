import { Router } from "express";
import { getRides, getRide, createRide, deleteRide, updateRide } from "../controllers/rideController.js";

const router = Router();

router
  .get("/", getRides)

  .get("/:id", getRide)

  .post("/", createRide)

  .delete("/:id", deleteRide)

  .patch("/:id", updateRide);

export default router;
