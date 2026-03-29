import {
  Controller, Get, Post, Put, Body, Param, Query,
  UseGuards, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('报名')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private appService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: '提交报名申请' })
  apply(
    @CurrentUser() user: User,
    @Body() body: { clubId: number; batchId: number; motivation?: string; customAnswers?: any },
  ) {
    return this.appService.apply(user.id, body);
  }

  @Get('my')
  @ApiOperation({ summary: '我的报名记录' })
  getMyApplications(@CurrentUser() user: User) {
    return this.appService.getMyApplications(user.id);
  }

  @Get('active-batch')
  @ApiOperation({ summary: '获取当前活跃招新批次' })
  getActiveBatch() {
    return this.appService.getActiveBatch();
  }

  @Put(':id/withdraw')
  @ApiOperation({ summary: '撤回报名' })
  withdraw(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.appService.withdraw(user.id, id);
  }

  @Get('club/:clubId')
  @ApiOperation({ summary: '获取社团收到的报名列表（社团管理员）' })
  getClubApplications(
    @Param('clubId', ParseIntPipe) clubId: number,
    @CurrentUser() user: User,
    @Query('batchId') batchId?: string,
  ) {
    return this.appService.getClubApplications(clubId, user.id, batchId ? +batchId : undefined);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新报名状态（社团管理员）' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() body: { status: any; score?: number; remark?: string },
  ) {
    return this.appService.updateStatus(id, user.id, body.status, {
      score: body.score,
      remark: body.remark,
    });
  }

  @Post(':id/interview')
  @ApiOperation({ summary: '安排面试（社团管理员）' })
  scheduleInterview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() body: any,
  ) {
    return this.appService.scheduleInterview(id, user.id, body);
  }
}
