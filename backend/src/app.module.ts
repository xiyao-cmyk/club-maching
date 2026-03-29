import { join } from 'path';
import { existsSync } from 'fs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// 仅在本地开发（无 DATABASE_URL）时初始化 pg-mem
let memDb: any = null;
if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { newDb } = require('pg-mem');
  memDb = newDb({ autoCreateForeignKeyIndices: true });
  memDb.public.registerFunction({ name: 'version', returns: 'text', implementation: () => 'PostgreSQL 14.0 (pg-mem)' } as any);
  memDb.public.registerFunction({ name: 'current_database', returns: 'text', implementation: () => 'club_matching' } as any);
  memDb.public.registerFunction({ name: 'obj_description', args: ['int', 'text'], returns: 'text', implementation: () => null } as any);
}

// 若 frontend/dist 存在则提供静态文件服务（本地开发和 Render 单体部署）
const frontendDistPath = join(process.cwd(), '..', 'frontend', 'dist');
const serveStaticModules = existsSync(join(frontendDistPath, 'index.html'))
  ? [ServeStaticModule.forRoot({ rootPath: frontendDistPath, exclude: ['/api/(.*)'] })]
  : [];

@Module({
  imports: [
    ...serveStaticModules,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
        ...(process.env.DATABASE_URL
          ? {
              url: process.env.DATABASE_URL,
              ssl: { rejectUnauthorized: false },
            }
          : {}),
      }),
      dataSourceFactory: async (options) => {
        if (process.env.DATABASE_URL) {
          // 生产环境：连接真实 PostgreSQL
          console.log('[DB] Connecting to PostgreSQL...');
          const ds = new DataSource(options!);
          await ds.initialize();
          console.log('[DB] Connected successfully');
          return ds;
        }
        // 本地开发：使用 pg-mem 内存数据库
        const ds = await memDb.adapters.createTypeormDataSource(options);
        await ds.initialize();
        return ds;
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ClubsModule,
    QuestionnaireModule,
    RecommendationModule,
    ApplicationsModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}
