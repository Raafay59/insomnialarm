import express from "express";
import { PORT, MONGO_URL, creds, testImage } from "./config.js";
import mongoose from "mongoose";
import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";

const app = express();
app.use(express.json());

function containsLabel(data, labelName) {
  if (data && data.Labels && Array.isArray(data.Labels)) {
    return data.Labels.some(
      (label) => label.Name.toLowerCase() === labelName.toLowerCase()
    );
  }
  return false;
}

app.get("/", async (req, res) => {
  console.log("Hello");
  const client = new RekognitionClient({
    region: "us-east-1",
    credentials: creds,
  });
  const input = {
    Features: ["GENERAL_LABELS"],
    Image: {
      Bytes: Buffer.from(testImage, "base64"),
    },
    MaxLabels: 10,
    MinConfidence: 0,
  };
  const command = new DetectLabelsCommand(input);
  try {
    const response = await client.send(command);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while detecting labels" });
  }
});

app.post("/test", async (req, res) => {
  console.log("POST request received");
  try {
    const image = req.body.base64;
    const label = req.body.label;
    const client = new RekognitionClient({
      region: "us-east-1",
      credentials: creds,
    });
    const input = {
      Features: ["GENERAL_LABELS"],
      Image: {
        Bytes: Buffer.from(image, "base64"),
      },
      MaxLabels: 10,
      MinConfidence: 0,
    };
    const command = new DetectLabelsCommand(input);
    const response = await client.send(command);
    console.log(JSON.stringify(response));
    if (containsLabel(response, label)) {
      return res.status(200).json({ success: true });
    }
    return res.status(200).json({ success: false });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while detecting labels" });
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
