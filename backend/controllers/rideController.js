import RideModel from "../models/RideModel.js";
import mongoose from "mongoose";

const ERR_NO_RIDE = { error: "Ride does not exist" };

export const getRides = async (req, res) => {
  const rides = await RideModel.find({}).sort({ createdAt: -1 });
  res.status(200).json(rides);
};

export const getRide = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).json(ERR_NO_RIDE);

  const ride = await RideModel.findById(id);

  if (!ride) res.status(404).json(ERR_NO_RIDE);

  res.status(200).json(ride);
};

export const createRide = async (req, res) => {
  const { title, distance, elevation } = req.body;

  try {
    const ride = await RideModel.create({ title, distance, elevation });
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json(ERR_NO_RIDE);
  }
};

export const deleteRide = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).json(ERR_NO_RIDE);

  const ride = await RideModel.findOneAndDelete({ _id: id });

  if (!ride) res.status(404).json(ERR_NO_RIDE);

  res.status(200).json(ride);
};

export const updateRide = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).json(ERR_NO_RIDE);

  const ride = await RideModel.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!ride) res.status(404).json(ERR_NO_RIDE);

  res.status(200).json(ride);
};
