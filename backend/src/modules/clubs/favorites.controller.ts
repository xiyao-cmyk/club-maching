import { Controller, Get, Post, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { Favorite } from '../../entities/favorite.entity';

@ApiTags('收藏')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(
    @InjectRepository(Favorite)
    private favRepo: Repository<Favorite>,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取我的收藏列表' })
  async getMyFavorites(@CurrentUser() user: User) {
    return this.favRepo.find({
      where: { userId: user.id },
      relations: ['club', 'club.category', 'club.tags'],
      order: { createdAt: 'DESC' },
    });
  }

  @Post(':clubId')
  @ApiOperation({ summary: '收藏社团' })
  async addFavorite(@CurrentUser() user: User, @Param('clubId', ParseIntPipe) clubId: number) {
    const existing = await this.favRepo.findOne({ where: { userId: user.id, clubId } });
    if (existing) return existing;
    const fav = this.favRepo.create({ userId: user.id, clubId });
    return this.favRepo.save(fav);
  }

  @Delete(':clubId')
  @ApiOperation({ summary: '取消收藏' })
  async removeFavorite(@CurrentUser() user: User, @Param('clubId', ParseIntPipe) clubId: number) {
    await this.favRepo.delete({ userId: user.id, clubId });
    return { success: true };
  }

  @Get('check/:clubId')
  @ApiOperation({ summary: '检查是否已收藏' })
  async checkFavorite(@CurrentUser() user: User, @Param('clubId', ParseIntPipe) clubId: number) {
    const existing = await this.favRepo.findOne({ where: { userId: user.id, clubId } });
    return { favorited: !!existing };
  }
}
