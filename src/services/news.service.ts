import { newsRepository } from '@/src/repositories/news.repository'
import { createNewsSchema, updateNewsSchema } from '@/src/validations/news.validation'
import { logService } from './log.service'
import { slugify } from '@/src/lib/utils'
import { uploadImage, deleteImage, extractPublicIdFromUrl } from '@/src/lib/cloudinary'
import { AppError, NotFoundError, ConflictError } from '@/src/lib/errors'
import { Prisma } from '@prisma/client'

export const newsService = {
  async getAllPublic(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [news, total] = await Promise.all([
      newsRepository.findAll(skip, limit),
      newsRepository.count()
    ])
    return {
      data: news,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  },

  async getById(id: string) {
    const news = await newsRepository.findById(id)
    if (!news) throw new NotFoundError('Berita tidak ditemukan')
    return news
  },

  async create(data: any, userId: string, imageBase64?: string) {
    const validated = createNewsSchema.parse(data)
    let imageUrl: string | undefined = validated.image
    if (imageBase64) {
      const { url } = await uploadImage(imageBase64, 'news')
      imageUrl = url
    }
    const slug = slugify(validated.title)
    try {
      const news = await newsRepository.create({
        title: validated.title,
        content: validated.content,
        slug,
        image: imageUrl,
        createdBy: userId
      })
      await logService.createActivity(userId, 'CREATE_NEWS', `News "${news.title}" created`, news.id)
      return news
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Slug sudah digunakan, judul mungkin duplicate')
      }
      throw error
    }
  },

  async update(id: string, data: any, userId: string, imageBase64?: string) {
    const existing = await newsRepository.findById(id)
    if (!existing) throw new NotFoundError('Berita tidak ditemukan')

    const validated = updateNewsSchema.parse(data)
    let imageUrl = validated.image ?? existing.image
    if (imageBase64) {
      if (existing.image) {
        const publicId = extractPublicIdFromUrl(existing.image)
        if (publicId) await deleteImage(publicId)
      }
      const { url } = await uploadImage(imageBase64, 'news')
      imageUrl = url
    }

    const updateData: any = {}
    if (validated.title !== undefined) updateData.title = validated.title
    if (validated.content !== undefined) updateData.content = validated.content
    if (imageUrl !== undefined) updateData.image = imageUrl
    if (validated.title && validated.title !== existing.title) {
      const slug = slugify(validated.title)
      updateData.slug = slug
    }

    try {
      const updated = await newsRepository.update(id, updateData)
      await logService.createActivity(userId, 'UPDATE_NEWS', `News "${updated.title}" updated`, updated.id)
      return updated
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Slug sudah digunakan, judul mungkin duplicate')
      }
      throw error
    }
  },

  async delete(id: string, userId: string) {
    const existing = await newsRepository.findById(id)
    if (!existing) throw new NotFoundError('Berita tidak ditemukan')
    if (existing.image) {
      const publicId = extractPublicIdFromUrl(existing.image)
      if (publicId) await deleteImage(publicId)
    }
    await newsRepository.delete(id)
    await logService.createActivity(userId, 'DELETE_NEWS', `News "${existing.title}" deleted`, id)
    return true
  }
}