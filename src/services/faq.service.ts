import { faqRepository } from '@/src/repositories/faq.repository'
import { createFaqSchema, updateFaqSchema } from '@/src/validations/faq.validation'
import { logService } from './log.service'
import { NotFoundError } from '@/src/lib/errors'

export const faqService = {
  async getAllPublic() {
    // Repository sudah filter status 'published'
    return faqRepository.findAllPublished()
  },

  async getById(id: string) {
    const faq = await faqRepository.findById(id)
    if (!faq) throw new NotFoundError('FAQ tidak ditemukan')
    return faq
  },

  async create(data: any, userId: string) {
    const validated = createFaqSchema.parse(data)
    const faq = await faqRepository.create({
      question: validated.question,
      answer: validated.answer,
      status: validated.status || 'draft'
    })
    await logService.createActivity(userId, 'CREATE_FAQ', `FAQ "${faq.question}" created`, faq.id)
    return faq
  },

  async update(id: string, data: any, userId: string) {
    const existing = await faqRepository.findById(id)
    if (!existing) throw new NotFoundError('FAQ tidak ditemukan')
    const validated = updateFaqSchema.parse(data)
    const updated = await faqRepository.update(id, {
      question: validated.question,
      answer: validated.answer
    })
    await logService.createActivity(userId, 'UPDATE_FAQ', `FAQ "${updated.question}" updated`, updated.id)
    return updated
  },

  async updateStatus(id: string, status: string, userId: string) {
    const existing = await faqRepository.findById(id)
    if (!existing) throw new NotFoundError('FAQ tidak ditemukan')
    const updated = await faqRepository.updateStatus(id, status as any)
    await logService.createActivity(userId, 'UPDATE_FAQ_STATUS', `FAQ "${updated.question}" status changed to ${status}`, updated.id)
    return updated
  },

  async delete(id: string, userId: string) {
    const existing = await faqRepository.findById(id)
    if (!existing) throw new NotFoundError('FAQ tidak ditemukan')
    await faqRepository.delete(id)
    await logService.createActivity(userId, 'DELETE_FAQ', `FAQ "${existing.question}" deleted`, id)
    return true
  }
}