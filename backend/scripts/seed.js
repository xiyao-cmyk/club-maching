"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'club_user',
    password: process.env.DB_PASSWORD ?? 'club_pass123',
    database: process.env.DB_DATABASE ?? 'club_matching',
    entities: [],
    charset: 'utf8mb4',
});
async function seed() {
    await AppDataSource.initialize();
    const hash = await bcrypt.hash('Admin123!', 10);
    await AppDataSource.query(`
    INSERT IGNORE INTO users (email, password, name, role) VALUES
    ('admin@test.com', ?, '系统管理员', 'admin'),
    ('club@test.com', ?, '摄影社社长', 'club_admin'),
    ('student@test.com', ?, '张同学', 'student')
  `, [hash, hash, hash]);
    console.log('✅ 用户种子数据写入完成');
    await AppDataSource.destroy();
}
seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map