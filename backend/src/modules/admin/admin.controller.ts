import {
  Controller, Get, Post, Put, Body, Param, Query,
  UseGuards, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('管理后台')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '管理后台总览数据' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('clubs')
  @ApiOperation({ summary: '获取所有社团（含待审核）' })
  getAllClubs(@Query('status') status?: string) {
    return this.adminService.getAllClubs(status);
  }

  @Put('clubs/:id/approve')
  @ApiOperation({ summary: '审核通过社团' })
  approveClub(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveClub(id);
  }

  @Put('clubs/:id/reject')
  @ApiOperation({ summary: '驳回社团' })
  rejectClub(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.rejectClub(id);
  }

  @Get('users')
  @ApiOperation({ summary: '获取用户列表' })
  getAllUsers(@Query('role') role?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.getAllUsers(role, page ? +page : 1, pageSize ? +pageSize : 20);
  }

  @Get('batches')
  @ApiOperation({ summary: '获取招新批次列表' })
  getBatches() {
    return this.adminService.getBatches();
  }

  @Post('batches')
  @ApiOperation({ summary: '创建招新批次' })
  createBatch(@Body() body: any, @CurrentUser() user: User) {
    return this.adminService.createBatch(body, user.id);
  }

  @Put('batches/:id')
  @ApiOperation({ summary: '更新招新批次' })
  updateBatch(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateBatch(id, body);
  }

  @Get('announcements')
  @ApiOperation({ summary: '获取公告列表' })
  getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  @Post('announcements')
  @ApiOperation({ summary: '创建公告' })
  createAnnouncement(@Body() body: any, @CurrentUser() user: User) {
    return this.adminService.createAnnouncement(body, user.id);
  }

  @Put('announcements/:id')
  @ApiOperation({ summary: '更新公告' })
  updateAnnouncement(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateAnnouncement(id, body);
  }

  @Get('stats/applications')
  @ApiOperation({ summary: '报名统计' })
  getApplicationStats(@Query('batchId') batchId?: string) {
    return this.adminService.getApplicationStats(batchId ? +batchId : undefined);
  }
}
