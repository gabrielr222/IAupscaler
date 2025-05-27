import { IncomingForm } from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true, uploadDir: path.join(process.cwd(), '/tmp') });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    try {
      const file = files.file[0]; // formidable v3 returns arrays
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'pixupscaler_uploads',
      });

      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
}
