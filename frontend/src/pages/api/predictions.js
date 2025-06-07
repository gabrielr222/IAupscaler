import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  try {
    const prediction = await replicate.predictions.create({
      version: 'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e',
      input: { image },
    });

    // Polling until it's done
    let output = null;
    while (
      prediction.status !== 'succeeded' &&
      prediction.status !== 'failed'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await replicate.predictions.get(prediction.id);
      prediction.status = response.status;
      prediction.output = response.output;
    }

    if (prediction.status === 'succeeded' && Array.isArray(prediction.output) && prediction.output[0]) {
      return res.status(200).json({ imageUrl: prediction.output[0] });
    } else {
      return res.status(500).json({ error: 'No valid image output from Replicate', output: prediction.output });
    }
  } catch (error) {
    console.error('Replicate error:', error);
    return res.status(500).json({ error: 'Prediction failed' });
  }
}
