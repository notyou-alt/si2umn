import { contentRepository } from '@/src/repositories/content.repository'
import { createContentSchema, updateContentSchema } from '@/src/validations/content.validation'
import { uploadImage, deleteImage, extractPublicIdFromUrl } from '@/src/lib/cloudinary'
import { NotFoundError, ConflictError } from '@/src/lib/errors'
import { Prisma } from '@prisma/client'

export const contentService = {
  async create(data: unknown, imageBase64?: string) {
    const validated = createContentSchema.parse(data)
    let imageUrl = validated.image
    if (imageBase64) {
      const { url } = await uploadImage(imageBase64, 'contents')
      imageUrl = url
    }
    // Check uniqueness of order_no per section (optional, but safe)
    const existing = await contentRepository.findBySectionAndOrder(validated.sectionId, validated.order_no)
    if (existing) throw new ConflictError('Order number already used in this section')
    try {
      const content = await contentRepository.create({
        section: { connect: { id: validated.sectionId } },
        title: validated.title,
        content: validated.content,
        image: imageUrl,
        order_no: validated.order_no
      })
      return content
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Order number already used in this section')
      }
      throw error
    }
  },

  async update(id: string, data: unknown, imageBase64?: string) {
    const existing = await contentRepository.findById(id)
    if (!existing) throw new NotFoundError('Konten tidak ditemukan')
    const validated = updateContentSchema.parse(data)
    let imageUrl = validated.image ?? existing.image
    if (imageBase64) {
      if (existing.image) {
        const publicId = extractPublicIdFromUrl(existing.image)
        if (publicId) await deleteImage(publicId)
      }
      const { url } = await uploadImage(imageBase64, 'contents')
      imageUrl = url
    }
    const updateData: any = {
      title: validated.title,
      content: validated.content,
      image: imageUrl,
      order_no: validated.order_no
    }
    const updated = await contentRepository.update(id, updateData)
    return updated
  },

  async delete(id: string) {
    const existing = await contentRepository.findById(id)
    if (!existing) throw new NotFoundError('Konten tidak ditemukan')
    if (existing.image) {
      const publicId = extractPublicIdFromUrl(existing.image)
      if (publicId) await deleteImage(publicId)
    }
    await contentRepository.delete(id)
    return true
  }
}