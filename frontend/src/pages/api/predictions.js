import Replicate from 'replicate';
import { db } from '../../lib/firebaseAdmin';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const RATE_PER_SECOND = 0.006;
const PRECISE_COST = 0.15;
const CREATIVE_VERSION = 'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e';
const PRECISE_VERSION = '2fdc3b86a01d338ae89ad58e5d9241398a8a01de9b0dda41ba8a0434c8a00dc3';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, uid, mode = 'creative' } = req.body;

  if (!image || !uid) {
    return res.status(400).json({ error: 'Missing image or uid' });
  }

  try {
    const start = Date.now();

    let prediction;
    if (mode === 'precise') {
      prediction = await replicate.predictions.create({
        version: PRECISE_VERSION,
        input: {
          image,
          enhance_model: 'Low Resolution V2',
          output_format: 'jpg',
          upscale_factor: '2x',
        },
      });
    } else {
      prediction = await replicate.predictions.create({
        version: CREATIVE_VERSION,
        input: { image, output_format: 'jpg' },
      });
    }

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await replicate.predictions.get(prediction.id);
      prediction.status = response.status;
      prediction.output = response.output;
    }

    const end = Date.now();
    const durationSeconds = Math.max((end - start) / 1000, 1); // mínimo 1 segundo
    const costCharged =
      mode === 'precise'
        ? PRECISE_COST
        : parseFloat((durationSeconds * RATE_PER_SECOND).toFixed(2));

    let outputUrl = null;
    if (prediction.status === 'succeeded') {
      if (Array.isArray(prediction.output) && prediction.output[0]) {
        outputUrl = prediction.output[0];
      } else if (
        prediction.output &&
        typeof prediction.output === 'object' &&
        prediction.output.image
      ) {
        outputUrl = prediction.output.image;
      } else if (typeof prediction.output === 'string') {
        outputUrl = prediction.output;
      }
    }

    if (prediction.status === 'succeeded' && outputUrl) {
      const userRef = db.collection('users').doc(uid);
      let updatedCredits = 0;
      let updatedFreeUsesLeft = 0;

      try {
        const snap = await userRef.get();

        if (!snap.exists) {
          updatedCredits = 0;
          updatedFreeUsesLeft = 1;
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

      let storedUrl = outputUrl;
      try {
        const uploadRes = await cloudinary.uploader.upload(outputUrl, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        storedUrl = uploadRes.secure_url;
        const historyRef = userRef.collection('history');
        await historyRef.add({ imageUrl: storedUrl, timestamp: Date.now() });

        const old = await historyRef
          .orderBy('timestamp', 'desc')
          .offset(3)
          .get();
        await Promise.all(old.docs.map((d) => d.ref.delete()));
      } catch (histErr) {
        console.error('Failed to store history:', histErr);
      }

      return res.status(200).json({
        imageUrl: storedUrl,
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
