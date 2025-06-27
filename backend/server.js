/* ---------------------- backend/server.js ---------------------- */
// Backend using Node.js and Express
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

// Optional: Enable CORS for development
const cors = require("cors");
app.use(cors());

app.post("/api/enhance", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
        input: {
          image: `data:image/jpeg;base64,${base64Image}`,
          output_format: "jpg"
        }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const prediction = response.data;

    let outputUrl = null;
    while (!outputUrl && prediction.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const pollRes = await axios.get(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
      });
      if (pollRes.data.status === "succeeded") {
        outputUrl = pollRes.data.output;
      }
    }

    res.json({ imageUrl: outputUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to enhance image" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
