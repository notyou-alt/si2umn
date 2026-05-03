import { activityLogRepository } from '@/src/repositories/log.repository'

type ActionType = 
  | 'CREATE_NEWS' | 'UPDATE_NEWS' | 'DELETE_NEWS'
  | 'CREATE_FAQ' | 'UPDATE_FAQ' | 'DELETE_FAQ' | 'UPDATE_FAQ_STATUS'
  | 'CREATE_TESTIMONY' | 'UPDATE_TESTIMONY' | 'DELETE_TESTIMONY' | 'UPDATE_TESTIMONY_STATUS'

export const logService = {
  async createActivity(userId: string, action: ActionType, target: string, entityId?: string) {
    await activityLogRepository.create({
      userId,
      action,
      target,
      // bisa tambahkan metadata jika perlu
    })
  }
}