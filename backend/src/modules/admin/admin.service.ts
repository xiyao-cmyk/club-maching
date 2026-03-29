import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../entities/club.entity';
import { User } from '../../entities/user.entity';
import { Application } from '../../entities/application.entity';
import { RecruitmentBatch } from '../../entities/recruitment-batch.entity';
import { Announcement } from '../../entities/announcement.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Club)
    private clubsRepo: Repository<Club>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    @InjectRepository(RecruitmentBatch)
    private batchRepo: Repository<RecruitmentBatch>,
    @InjectRepository(Announcement)
    private announcementsRepo: Repository<Announcement>,
  ) {}

  async getDashboard() {
    const totalClubs = await this.clubsRepo.count({ where: { status: 'active' } });
    const pendingClubs = await this.clubsRepo.count({ where: { status: 'pending' } });
    const totalStudents = await this.usersRepo.count({ where: { role: 'student' } });
    const totalApplications = await this.appRepo.count();
    const admittedApplications = await this.appRepo.count({ where: { status: 'admitted' } });

    return {
      totalClubs,
      pendingClubs,
      totalStudents,
      totalApplications,
      admittedApplications,
      admitRate: totalApplications > 0 ? ((admittedApplications / totalApplications) * 100).toFixed(1) : '0',
    };
  }

  async getAllClubs(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.clubsRepo.find({ where, relations: ['category'], order: { createdAt: 'DESC' } });
  }

  async approveClub(id: number) {
    await this.clubsRepo.update(id, { status: 'active' });
    return this.clubsRepo.findOne({ where: { id } });
  }

  async rejectClub(id: number) {
    await this.clubsRepo.update(id, { status: 'inactive' });
    return this.clubsRepo.findOne({ where: { id } });
  }

  async getAllUsers(role?: string, page = 1, pageSize = 20) {
    const where: any = {};
    if (role) where.role = role;
    const [items, total] = await this.usersRepo.findAndCount({
      where,
      select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  async getBatches() {
    return this.batchRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createBatch(data: Partial<RecruitmentBatch>, createdBy: number) {
    const batch = this.batchRepo.create({ ...data, createdBy });
    return this.batchRepo.save(batch);
  }

  async updateBatch(id: number, data: Partial<RecruitmentBatch>) {
    await this.batchRepo.update(id, data);
    return this.batchRepo.findOne({ where: { id } });
  }

  async getAnnouncements() {
    return this.announcementsRepo.find({ order: { sortOrder: 'DESC', createdAt: 'DESC' } });
  }

  async createAnnouncement(data: Partial<Announcement>, createdBy: number) {
    const announcement = this.announcementsRepo.create({ ...data, createdBy });
    return this.announcementsRepo.save(announcement);
  }

  async updateAnnouncement(id: number, data: Partial<Announcement>) {
    await this.announcementsRepo.update(id, data);
    return this.announcementsRepo.findOne({ where: { id } });
  }

  async getApplicationStats(batchId?: number) {
    const query = this.appRepo.createQueryBuilder('app')
      .select('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('app.status');

    if (batchId) query.where('app.batchId = :batchId', { batchId });

    return query.getRawMany();
  }
}
