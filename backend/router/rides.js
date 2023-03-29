import { Router } from "express";

const router = Router();

router
  .get("/", (req, res) => {
    res.json({ dummy: "GET all rides" });
  })

  .get("/:id", (req, res) => {
    res.json({ dummy: "GET a ride" });
  })

  .post("/", (req, res) => {
    res.json({ dummy: "POST a ride" });
  })

  .delete("/:id", (req, res) => {
    res.json({ dummy: "DELETE a ride" });
  })

  .patch("/:id", (req, res) => {
    res.json({ dummy: "UPDATE a ride" });
  });

export default router;
