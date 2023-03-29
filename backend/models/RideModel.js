import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rideSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
    },
    elevation: {
      type: Number,
    },
  },
  { timestamps: true }
);

const RideModel = mongoose.model("Ride", rideSchema);

export default RideModel;
