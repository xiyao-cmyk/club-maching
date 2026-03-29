import {
  Controller, Get, Post, Put, Body, Param, Query,
  UseGuards, ParseIntPipe, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('社团')
@Controller('clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Get()
  @ApiOperation({ summary: '社团列表（公开）' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  findAll(@Query() query: any) {
    return this.clubsService.findAll({
      categoryId: query.categoryId ? +query.categoryId : undefined,
      keyword: query.keyword,
      page: query.page ? +query.page : 1,
      pageSize: query.pageSize ? +query.pageSize : 12,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: '获取社团分类列表' })
  getCategories() {
    return this.clubsService.getCategories();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我管理的社团' })
  getMyClub(@CurrentUser() user: User) {
    return this.clubsService.getMyClub(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '社团详情' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const userId = req.user?.id;
    return this.clubsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建社团（管理员或社团负责人）' })
  createClub(@CurrentUser() user: User, @Body() body: any) {
    return this.clubsService.createClub({ ...body, adminUserId: user.id, status: 'pending' });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新社团信息' })
  updateClub(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() body: any,
  ) {
    const isAdmin = user.role === 'admin';
    return this.clubsService.updateClub(id, user.id, body, isAdmin);
  }

  @Put(':id/tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新社团标签' })
  saveTags(@Param('id', ParseIntPipe) id: number, @Body() body: { tags: Array<{ tag: string; tagType: string }> }) {
    return this.clubsService.saveTags(id, body.tags);
  }

  @Get(':id/recruitment')
  @ApiOperation({ summary: '获取社团招新配置' })
  getRecruitmentConfig(@Param('id', ParseIntPipe) id: number, @Query('batchId') batchId?: string) {
    return this.clubsService.getRecruitmentConfig(id, batchId ? +batchId : undefined);
  }

  @Put(':id/recruitment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新社团招新配置' })
  upsertRecruitmentConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const { batchId, ...config } = body;
    return this.clubsService.upsertRecruitmentConfig(id, batchId, config);
  }

  @Post(':id/behavior')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '记录用户行为' })
  recordBehavior(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() body: { eventType: string; durationMs?: number },
  ) {
    return this.clubsService.recordBehavior(user.id, id, body.eventType, body.durationMs);
  }
}
