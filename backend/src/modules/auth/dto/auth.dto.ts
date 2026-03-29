import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Student123!' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'student@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Student123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '张同学' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'student', required: false })
  @IsOptional()
  @IsIn(['student', 'club_admin'])
  role?: 'student' | 'club_admin';
}
