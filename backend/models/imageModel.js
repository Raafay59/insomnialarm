import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
  base64: {
    type: String,
    required: true,
  },
});

export const Image = mongoose.model("Image", imageSchema);
