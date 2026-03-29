import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  async getMyNotifications(userId: number) {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: number) {
    const count = await this.notifRepo.count({ where: { userId, isRead: false } });
    return { count };
  }

  async markRead(userId: number, id?: number) {
    if (id) {
      await this.notifRepo.update({ id, userId }, { isRead: true });
    } else {
      await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
    }
    return { success: true };
  }
}
