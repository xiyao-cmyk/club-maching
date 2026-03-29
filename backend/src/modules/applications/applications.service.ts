import {
  Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from '../../entities/application.entity';
import { Interview } from '../../entities/interview.entity';
import { Notification } from '../../entities/notification.entity';
import { Club } from '../../entities/club.entity';
import { RecruitmentBatch } from '../../entities/recruitment-batch.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    @InjectRepository(Interview)
    private interviewRepo: Repository<Interview>,
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
    @InjectRepository(Club)
    private clubRepo: Repository<Club>,
    @InjectRepository(RecruitmentBatch)
    private batchRepo: Repository<RecruitmentBatch>,
  ) {}

  async apply(userId: number, body: { clubId: number; batchId: number; motivation?: string; customAnswers?: any }) {
    const existing = await this.appRepo.findOne({
      where: { userId, clubId: body.clubId, batchId: body.batchId },
    });
    if (existing) throw new ConflictException('已经报名该社团');

    const app = this.appRepo.create({
      userId,
      clubId: body.clubId,
      batchId: body.batchId,
      motivation: body.motivation,
      customAnswers: body.customAnswers,
      status: 'pending',
    });
    const saved = await this.appRepo.save(app);

    const club = await this.clubRepo.findOne({ where: { id: body.clubId } });
    await this.sendNotification(userId, '报名成功', `你已成功报名 ${club?.name ?? '社团'}，请耐心等待审核结果。`, 'application', { applicationId: saved.id });

    return saved;
  }

  async getMyApplications(userId: number) {
    return this.appRepo.find({
      where: { userId },
      relations: ['club', 'club.category', 'batch', 'interview'],
      order: { createdAt: 'DESC' },
    });
  }

  async withdraw(userId: number, appId: number) {
    const app = await this.appRepo.findOne({ where: { id: appId, userId } });
    if (!app) throw new NotFoundException('报名记录不存在');
    if (['admitted', 'rejected'].includes(app.status)) {
      throw new BadRequestException('当前状态无法撤回');
    }
    app.status = 'withdrawn';
    return this.appRepo.save(app);
  }

  async getClubApplications(clubId: number, userId: number, batchId?: number) {
    const club = await this.clubRepo.findOne({ where: { id: clubId } });
    if (!club) throw new NotFoundException('社团不存在');
    if (club.adminUserId !== userId) throw new ForbiddenException('无权限');

    const query = this.appRepo.createQueryBuilder('app')
      .leftJoinAndSelect('app.user', 'user')
      .leftJoinAndSelect('app.interview', 'interview')
      .where('app.clubId = :clubId', { clubId });

    if (batchId) query.andWhere('app.batchId = :batchId', { batchId });

    return query.orderBy('app.createdAt', 'DESC').getMany();
  }

  async updateStatus(
    appId: number,
    clubAdminUserId: number,
    status: ApplicationStatus,
    options?: { score?: number; remark?: string },
  ) {
    const app = await this.appRepo.findOne({
      where: { id: appId },
      relations: ['club'],
    });
    if (!app) throw new NotFoundException('报名记录不存在');
    if (app.club.adminUserId !== clubAdminUserId) throw new ForbiddenException('无权限');

    app.status = status;
    if (options?.score !== undefined) app.score = options.score;
    if (options?.remark !== undefined) app.remark = options.remark;
    await this.appRepo.save(app);

    let title = '';
    let content = '';
    let type: any = 'application';

    if (status === 'admitted') {
      title = '恭喜！录取通知';
      content = `恭喜你被 ${app.club.name} 录取！请关注后续入群通知。`;
      type = 'result';
    } else if (status === 'rejected') {
      title = '招新结果通知';
      content = `感谢你对 ${app.club.name} 的热情，遗憾未能录取，欢迎继续尝试其他社团。`;
      type = 'result';
    } else if (status === 'interview') {
      title = '面试通知';
      content = `${app.club.name} 邀请你参加面试，请查看面试详情。`;
      type = 'interview';
    }

    if (title) {
      await this.sendNotification(app.userId, title, content, type, { applicationId: app.id });
    }

    return app;
  }

  async scheduleInterview(appId: number, clubAdminUserId: number, data: Partial<Interview>) {
    const app = await this.appRepo.findOne({ where: { id: appId }, relations: ['club'] });
    if (!app) throw new NotFoundException('报名记录不存在');
    if (app.club.adminUserId !== clubAdminUserId) throw new ForbiddenException('无权限');

    let interview = await this.interviewRepo.findOne({ where: { applicationId: appId } });
    if (!interview) {
      interview = this.interviewRepo.create({ applicationId: appId });
    }
    Object.assign(interview, data);
    await this.interviewRepo.save(interview);

    app.status = 'interview';
    await this.appRepo.save(app);

    await this.sendNotification(
      app.userId,
      '面试通知',
      `${app.club.name} 邀请你于 ${new Date(data.interviewTime).toLocaleString('zh-CN')} 参加面试，地点：${data.location ?? '线上'}`,
      'interview',
      { applicationId: app.id },
    );

    return interview;
  }

  async getActiveBatch() {
    return this.batchRepo.findOne({ where: { status: 'active' }, order: { createdAt: 'DESC' } });
  }

  private async sendNotification(userId: number, title: string, content: string, type: any, meta?: any) {
    const notif = this.notifRepo.create({ userId, title, content, type, meta });
    await this.notifRepo.save(notif).catch(() => {});
  }
}
