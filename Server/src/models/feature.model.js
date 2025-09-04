import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
    {
        image: {
            type: String,
        }
    },
    { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);

export default Feature;