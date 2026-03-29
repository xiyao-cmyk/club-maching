import { Controller, Get, Put, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('通知')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '获取我的通知列表' })
  getMyNotifications(@CurrentUser() user: User) {
    return this.notifService.getMyNotifications(user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: '获取未读通知数' })
  getUnreadCount(@CurrentUser() user: User) {
    return this.notifService.getUnreadCount(user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: '全部标记已读' })
  markAllRead(@CurrentUser() user: User) {
    return this.notifService.markRead(user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: '标记单条已读' })
  markRead(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.notifService.markRead(user.id, id);
  }
}
