// frontend/src/pages/api/replicate-run.js
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;

  try {
    const output = await replicate.run(
      "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      {
        input: { image, output_format: "jpg" },
      }
    );

    // output debe ser un array de URLs, según la documentación
    if (Array.isArray(output) && typeof output[0] === "string") {
      return res.status(200).json({ imageUrl: output[0] });
    } else {
      return res.status(500).json({ error: "No valid image output from Replicate", output });
    }
  } catch (error) {
    console.error("Replicate error:", error);
    return res.status(500).json({ error: "Error during enhancement", details: error.message });
  }
}
