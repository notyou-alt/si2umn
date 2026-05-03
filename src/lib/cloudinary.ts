import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(fileBase64: string, folder?: string): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: folder || 'cms',
      resource_type: 'image',
    })
    return { url: result.secure_url, publicId: result.public_id }
  } catch (error) {
    throw new Error('Gagal upload gambar ke Cloudinary')
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
  return match ? match[1] : null
}