import Replicate from 'replicate';
import { db } from '../../lib/firebaseAdmin';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const RATE_PER_SECOND = 0.006;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, uid } = req.body;

  if (!image || !uid) {
    return res.status(400).json({ error: 'Missing image or uid' });
  }

  try {
    const start = Date.now();

    const prediction = await replicate.predictions.create({
      version: 'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e',
      input: { image },
    });

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await replicate.predictions.get(prediction.id);
      prediction.status = response.status;
      prediction.output = response.output;
    }

    const end = Date.now();
    const durationSeconds = Math.max((end - start) / 1000, 1); // mínimo 1 segundo
    const costCharged = parseFloat((durationSeconds * RATE_PER_SECOND).toFixed(2));

    if (prediction.status === 'succeeded' && Array.isArray(prediction.output) && prediction.output[0]) {
      let updatedCredits = 0;
      let updatedFreeUsesLeft = 0;

      try {
        const userRef = db.collection('users').doc(uid);
        const snap = await userRef.get();

        if (!snap.exists) {
          updatedCredits = 0;
          updatedFreeUsesLeft = 3;
          await userRef.set({ credits: updatedCredits, freeUsesLeft: updatedFreeUsesLeft });
        } else {
          const data = snap.data();
          updatedCredits = data.credits || 0;
          updatedFreeUsesLeft = data.freeUsesLeft || 0;

          if (updatedFreeUsesLeft > 0) {
            updatedFreeUsesLeft -= 1;
          } else if (updatedCredits >= costCharged) {
            updatedCredits = parseFloat((updatedCredits - costCharged).toFixed(2));
          } else {
            return res.status(402).json({ error: 'Insufficient credits' });
          }

          await userRef.update({ credits: updatedCredits, freeUsesLeft: updatedFreeUsesLeft });

          // ✅ Registrar log de uso
          await db.collection('logs').add({
            uid,
            email: data.email || '',
            timestamp: new Date().toISOString(),
            duration: parseFloat(durationSeconds.toFixed(2)),
            cost: costCharged,
          });
        }
      } catch (dbErr) {
        console.error('Failed to update user credits:', dbErr);
      }

      return res.status(200).json({
        imageUrl: prediction.output[0],
        updatedCredits,
        updatedFreeUsesLeft,
        durationSeconds: parseFloat(durationSeconds.toFixed(2)),
        costCharged,
      });
    } else {
      return res.status(500).json({ error: 'No valid image output from Replicate', output: prediction.output });
    }
  } catch (error) {
    console.error('Replicate error:', error);
    return res.status(500).json({ error: 'Prediction failed' });
  }
}
