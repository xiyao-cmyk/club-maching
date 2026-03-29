import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { StudentProfile } from '../../entities/student-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(StudentProfile)
    private profilesRepo: Repository<StudentProfile>,
  ) {}

  async findProfile(userId: number) {
    const profile = await this.profilesRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('学生档案不存在');
    }
    return profile;
  }

  async updateProfile(userId: number, data: Partial<StudentProfile>) {
    let profile = await this.profilesRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profilesRepo.create({ userId });
    }
    Object.assign(profile, data);
    return this.profilesRepo.save(profile);
  }

  async updateUser(userId: number, data: { name?: string; phone?: string; avatar?: string }) {
    await this.usersRepo.update(userId, data);
    return this.usersRepo.findOne({ where: { id: userId } });
  }

  async findAll(role?: string) {
    const where: any = {};
    if (role) where.role = role;
    return this.usersRepo.find({ where, select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'] });
  }

  async toggleActive(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('用户不存在');
    user.isActive = !user.isActive;
    return this.usersRepo.save(user);
  }
}
