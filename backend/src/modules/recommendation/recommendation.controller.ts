import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('推荐')
@Controller('recommendation')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取个性化推荐社团列表' })
  async getRecommendations(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ): Promise<any[]> {
    return this.recommendationService.getRecommendations(user.id, limit ? +limit : 8);
  }

  @Get('announcements')
  @ApiOperation({ summary: '获取公告列表（首页）' })
  getAnnouncements() {
    return this.recommendationService.getAnnouncements();
  }

  @Get('stats')
  @ApiOperation({ summary: '获取平台统计数据' })
  getStats() {
    return this.recommendationService.getStats();
  }
}
