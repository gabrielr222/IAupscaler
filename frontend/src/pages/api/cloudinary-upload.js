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

  // ✅ Crear carpeta /tmp si no existe (necesario en Vercel)
  const tmpDir = path.join(process.cwd(), '/tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: tmpDir,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    try {
      if (!files.file || !files.file[0]) {
        console.error('File not found in upload');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = files.file[0];
      console.log('Uploading to Cloudinary:', file.originalFilename);

      const result = await cloudinary.uploader.upload(file.filepath, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });

      console.log('Cloudinary upload result:', result.secure_url);

      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
}
