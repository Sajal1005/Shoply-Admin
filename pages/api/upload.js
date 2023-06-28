import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  // console.log(req)
  try {
    const fileStr = req.body.file;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr);

    // You can access the uploaded image URL using `uploadedResponse.secure_url`
    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    
    console.error('Failed to upload image', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
