import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Club } from '../../entities/club.entity';
import { ClubTag } from '../../entities/club-tag.entity';
import { ClubCategory } from '../../entities/club-category.entity';
import { ClubRecruitmentConfig } from '../../entities/club-recruitment-config.entity';
import { BehaviorEvent } from '../../entities/behavior-event.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepo: Repository<Club>,
    @InjectRepository(ClubTag)
    private tagsRepo: Repository<ClubTag>,
    @InjectRepository(ClubCategory)
    private categoriesRepo: Repository<ClubCategory>,
    @InjectRepository(ClubRecruitmentConfig)
    private configsRepo: Repository<ClubRecruitmentConfig>,
    @InjectRepository(BehaviorEvent)
    private behaviorRepo: Repository<BehaviorEvent>,
  ) {}

  async findAll(query: { categoryId?: number; keyword?: string; page?: number; pageSize?: number }) {
    const { categoryId, keyword, page = 1, pageSize = 12 } = query;
    const where: FindOptionsWhere<Club> = { status: 'active' };
    if (categoryId) where.categoryId = categoryId;
    if (keyword) where.name = Like(`%${keyword}%`);

    const [items, total] = await this.clubsRepo.findAndCount({
      where,
      relations: ['category', 'tags'],
      order: { memberCount: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize };
  }

  async findOne(id: number, userId?: number) {
    const club = await this.clubsRepo.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });
    if (!club) throw new NotFoundException('社团不存在');

    await this.clubsRepo.increment({ id }, 'viewCount', 1);

    if (userId) {
      const event = this.behaviorRepo.create({ userId, clubId: id, eventType: 'view' });
      await this.behaviorRepo.save(event).catch(() => {});
    }

    const config = await this.configsRepo.findOne({
      where: { clubId: id, status: 'published' },
      relations: ['batch'],
      order: { createdAt: 'DESC' },
    });

    return { ...club, recruitmentConfig: config ?? null };
  }

  async getCategories() {
    return this.categoriesRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async createClub(data: Partial<Club>) {
    const club = this.clubsRepo.create(data);
    return this.clubsRepo.save(club);
  }

  async updateClub(id: number, userId: number, data: Partial<Club>, isAdmin = false) {
    const club = await this.clubsRepo.findOne({ where: { id } });
    if (!club) throw new NotFoundException('社团不存在');
    if (!isAdmin && club.adminUserId !== userId) throw new ForbiddenException('无权限');
    Object.assign(club, data);
    return this.clubsRepo.save(club);
  }

  async getMyClub(userId: number) {
    return this.clubsRepo.findOne({
      where: { adminUserId: userId },
      relations: ['category', 'tags'],
    });
  }

  async saveTags(clubId: number, tags: Array<{ tag: string; tagType: string }>) {
    await this.tagsRepo.delete({ clubId });
    const entities = tags.map((t) =>
      this.tagsRepo.create({ clubId, tag: t.tag, tagType: t.tagType as any }),
    );
    return this.tagsRepo.save(entities);
  }

  async getRecruitmentConfig(clubId: number, batchId?: number) {
    const where: any = { clubId };
    if (batchId) where.batchId = batchId;
    return this.configsRepo.findOne({ where, order: { createdAt: 'DESC' }, relations: ['batch'] });
  }

  async upsertRecruitmentConfig(clubId: number, batchId: number, data: Partial<ClubRecruitmentConfig>) {
    let config = await this.configsRepo.findOne({ where: { clubId, batchId } });
    if (!config) {
      config = this.configsRepo.create({ clubId, batchId });
    }
    Object.assign(config, data);
    return this.configsRepo.save(config);
  }

  async recordBehavior(userId: number, clubId: number, eventType: string, durationMs?: number) {
    const event = this.behaviorRepo.create({
      userId,
      clubId,
      eventType: eventType as any,
      durationMs,
    });
    return this.behaviorRepo.save(event);
  }

  async getDashboard(clubId: number, batchId: number) {
    const config = await this.configsRepo.findOne({ where: { clubId, batchId } });
    return {
      config,
      viewCount: (await this.clubsRepo.findOne({ where: { id: clubId } }))?.viewCount ?? 0,
    };
  }
}
