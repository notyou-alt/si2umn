import { testimonyRepository } from '@/src/repositories/testimony.repository'
import { createTestimonySchema, updateTestimonySchema } from '@/src/validations/testimony.validation'
import { logService } from './log.service'
import { uploadImage, deleteImage, extractPublicIdFromUrl } from '@/src/lib/cloudinary'
import { NotFoundError } from '@/src/lib/errors'

export const testimonyService = {
  async getAllPublic(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [testimonies, total] = await Promise.all([
      testimonyRepository.findAllPublished(skip, limit),
      testimonyRepository.countPublished()
    ])
    return {
      data: testimonies,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  },

  async getById(id: string) {
    const testimony = await testimonyRepository.findById(id)
    if (!testimony) throw new NotFoundError('Testimoni tidak ditemukan')
    return testimony
  },

  async create(data: any, userId?: string, imageBase64?: string) {
    const validated = createTestimonySchema.parse(data)
    let photoUrl = validated.photo
    if (imageBase64) {
      const { url } = await uploadImage(imageBase64, 'testimonies')
      photoUrl = url
    }
    const testimony = await testimonyRepository.create({
      sender_name: validated.sender_name,
      sender_position: validated.sender_position,
      photo: photoUrl,
      full_testimony: validated.full_testimony,
      date: new Date(validated.date),
      status: validated.status || 'draft'
    })
    if (userId) {
      await logService.createActivity(userId, 'CREATE_TESTIMONY', `Testimony from ${testimony.sender_name} created`, testimony.id)
    }
    return testimony
  },

  async update(id: string, data: any, userId: string, imageBase64?: string) {
    const existing = await testimonyRepository.findById(id)
    if (!existing) throw new NotFoundError('Testimoni tidak ditemukan')
    const validated = updateTestimonySchema.parse(data)
    let photoUrl = validated.photo ?? existing.photo
    if (imageBase64) {
      if (existing.photo) {
        const publicId = extractPublicIdFromUrl(existing.photo)
        if (publicId) await deleteImage(publicId)
      }
      const { url } = await uploadImage(imageBase64, 'testimonies')
      photoUrl = url
    }
    const updated = await testimonyRepository.update(id, {
      sender_name: validated.sender_name,
      sender_position: validated.sender_position,
      photo: photoUrl,
      full_testimony: validated.full_testimony,
      date: validated.date ? new Date(validated.date) : undefined,
      status: validated.status
    })
    await logService.createActivity(userId, 'UPDATE_TESTIMONY', `Testimony from ${updated.sender_name} updated`, updated.id)
    return updated
  },

  async updateStatus(id: string, status: string, userId: string) {
    const existing = await testimonyRepository.findById(id)
    if (!existing) throw new NotFoundError('Testimoni tidak ditemukan')
    const updated = await testimonyRepository.updateStatus(id, status as any)
    await logService.createActivity(userId, 'UPDATE_TESTIMONY_STATUS', `Testimony from ${updated.sender_name} status changed to ${status}`, updated.id)
    return updated
  },

  async delete(id: string, userId: string) {
    const existing = await testimonyRepository.findById(id)
    if (!existing) throw new NotFoundError('Testimoni tidak ditemukan')
    if (existing.photo) {
      const publicId = extractPublicIdFromUrl(existing.photo)
      if (publicId) await deleteImage(publicId)
    }
    await testimonyRepository.delete(id)
    await logService.createActivity(userId, 'DELETE_TESTIMONY', `Testimony from ${existing.sender_name} deleted`, id)
    return true
  }
}