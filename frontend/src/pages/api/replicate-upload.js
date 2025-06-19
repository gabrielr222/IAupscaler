import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

import streamifier from 'streamifier';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buffers = [];
  req.on('data', (chunk) => buffers.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(buffers);
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ imageUrl: result.secure_url });
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
