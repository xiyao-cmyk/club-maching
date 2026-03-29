import { Controller, Get, Put, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前学生档案' })
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新学生档案' })
  updateProfile(@CurrentUser() user: User, @Body() body: any) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Put('me')
  @ApiOperation({ summary: '更新个人基本信息' })
  updateMe(@CurrentUser() user: User, @Body() body: { name?: string; phone?: string; avatar?: string }) {
    return this.usersService.updateUser(user.id, body);
  }
}
