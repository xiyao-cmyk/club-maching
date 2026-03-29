import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { StudentProfile } from '../entities/student-profile.entity';
import { ClubCategory } from '../entities/club-category.entity';
import { Club } from '../entities/club.entity';
import { ClubTag } from '../entities/club-tag.entity';
import { RecruitmentBatch } from '../entities/recruitment-batch.entity';
import { ClubRecruitmentConfig } from '../entities/club-recruitment-config.entity';
import { QuestionnaireQuestion } from '../entities/questionnaire-question.entity';
import { Announcement } from '../entities/announcement.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(StudentProfile) private profilesRepo: Repository<StudentProfile>,
    @InjectRepository(ClubCategory) private categoriesRepo: Repository<ClubCategory>,
    @InjectRepository(Club) private clubsRepo: Repository<Club>,
    @InjectRepository(ClubTag) private tagsRepo: Repository<ClubTag>,
    @InjectRepository(RecruitmentBatch) private batchesRepo: Repository<RecruitmentBatch>,
    @InjectRepository(ClubRecruitmentConfig) private configsRepo: Repository<ClubRecruitmentConfig>,
    @InjectRepository(QuestionnaireQuestion) private questionsRepo: Repository<QuestionnaireQuestion>,
    @InjectRepository(Announcement) private announcementsRepo: Repository<Announcement>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.usersRepo.count();
    if (count > 0) return; // 已有数据，跳过
    this.logger.log('首次启动，初始化种子数据...');
    await this.seed();
    this.logger.log('种子数据初始化完成！');
  }

  private async seed() {
    const hash = await bcrypt.hash('Admin123!', 10);

    // ── 用户 ──────────────────────────────────────────
    const admin = await this.usersRepo.save(
      this.usersRepo.create({ email: 'admin@test.com', password: hash, name: '系统管理员', role: 'admin' }),
    );
    const clubAdmin = await this.usersRepo.save(
      this.usersRepo.create({ email: 'club@test.com', password: hash, name: '摄影社社长', role: 'club_admin' }),
    );
    const student = await this.usersRepo.save(
      this.usersRepo.create({ email: 'student@test.com', password: hash, name: '张同学', role: 'student' }),
    );
    await this.profilesRepo.save(
      this.profilesRepo.create({ userId: student.id, school: '示例大学', faculty: '计算机学院', major: '软件工程', grade: 1 }),
    );

    // ── 社团分类 ──────────────────────────────────────
    const cats = await this.categoriesRepo.save([
      { name: '文艺类', icon: 'music', sortOrder: 10 },
      { name: '体育类', icon: 'trophy', sortOrder: 20 },
      { name: '学术类', icon: 'book', sortOrder: 30 },
      { name: '科技类', icon: 'cpu', sortOrder: 40 },
      { name: '公益类', icon: 'heart', sortOrder: 50 },
      { name: '实践类', icon: 'briefcase', sortOrder: 60 },
    ].map(c => this.categoriesRepo.create(c)));

    // ── 社团 ──────────────────────────────────────────
    const clubData = [
      { name: '摄影协会', catIdx: 0, slogan: '用镜头记录青春', desc: '摄影协会成立于2010年，是校内最具活力的摄影爱好者团体。定期组织外拍、摄影展、技术分享等，欢迎零基础同学。', year: 2010, cnt: 120, freq: '每两周一次', adminId: clubAdmin.id, tags: ['摄影:interest','艺术:interest','创意:interest','后期修图:skill','零基础可报:requirement'] },
      { name: '编程与算法社', catIdx: 3, slogan: '代码改变世界', desc: '专注于算法竞赛、编程技能提升和项目实战，定期举办 Hackathon 和 ACM/ICPC 备赛培训。', year: 2015, cnt: 85, freq: '每周一次例会', adminId: null, tags: ['编程:interest','算法:interest','C++:skill','Python:skill','竞赛:goal'] },
      { name: '街舞社', catIdx: 0, slogan: 'Dance for Life', desc: '涵盖 Breaking、Popping、Locking 多种风格，每学期参加校内外比赛。', year: 2012, cnt: 60, freq: '每周三次训练', adminId: null, tags: ['舞蹈:interest','街舞:interest','表演:goal'] },
      { name: '羽毛球协会', catIdx: 1, slogan: '羽动青春', desc: '提供专业场地和训练指导，定期组织校内联赛，代表学校参加市级比赛。', year: 2008, cnt: 200, freq: '每天开放练习', adminId: null, tags: ['体育:interest','羽毛球:interest','零基础可报:requirement'] },
      { name: '志愿者协会', catIdx: 4, slogan: '奉献爱心，服务社会', desc: '组织各类公益活动，包括支教、社区服务、环保行动等，荣获省级优秀志愿服务组织。', year: 2005, cnt: 350, freq: '每月多次活动', adminId: null, tags: ['公益:interest','志愿服务:interest','奉献:goal','零基础可报:requirement'] },
      { name: '机器人社', catIdx: 3, slogan: '创造未来', desc: '参与 RoboMaster、RoboCom 等竞赛，配备专业实验室。', year: 2016, cnt: 45, freq: '每周两次项目推进', adminId: null, tags: ['机器人:interest','电路:skill','编程:skill','竞赛:goal'] },
      { name: '辩论队', catIdx: 2, slogan: '言之有物，论之有据', desc: '校级辩论冠军队，提供系统辩论训练，参加全国高校辩论赛。', year: 2003, cnt: 30, freq: '每周两次', adminId: null, tags: ['辩论:interest','口才:skill','逻辑思维:skill','竞赛:goal'] },
      { name: '吉他社', catIdx: 0, slogan: '弦动心弦', desc: '从零基础到进阶，系统学习吉他，每学期举办音乐会。', year: 2011, cnt: 70, freq: '每周一次', adminId: null, tags: ['音乐:interest','吉他:interest','零基础可报:requirement','表演:goal'] },
    ];

    const clubs: Club[] = [];
    for (const d of clubData) {
      const club = await this.clubsRepo.save(this.clubsRepo.create({
        name: d.name, categoryId: cats[d.catIdx].id, slogan: d.slogan,
        description: d.desc, foundedYear: d.year, memberCount: d.cnt,
        activityFrequency: d.freq, adminUserId: d.adminId, status: 'active',
      }));
      for (const t of d.tags) {
        const [tag, type] = t.split(':');
        await this.tagsRepo.save(this.tagsRepo.create({ clubId: club.id, tag, tagType: type as any }));
      }
      clubs.push(club);
    }

    // ── 招新批次 ──────────────────────────────────────
    const batch = await this.batchesRepo.save(this.batchesRepo.create({
      name: '2026年春季招新', startDate: '2026-03-01', endDate: '2026-04-30',
      status: 'active', description: '2026年春季学期社团招新，欢迎所有新生踊跃报名！', createdBy: admin.id,
    }));

    // ── 招新配置 ──────────────────────────────────────
    const cfgs = [
      { ci: 0, quota: 30, req: '对摄影感兴趣，积极参与活动', beginner: true, intensity: 2, interview: false },
      { ci: 1, quota: 20, req: '热爱编程，有代码基础', beginner: false, intensity: 4, interview: true },
      { ci: 2, quota: 15, req: '有舞蹈基础优先', beginner: false, intensity: 3, interview: true },
      { ci: 3, quota: 50, req: '喜欢羽毛球运动，无基础要求', beginner: true, intensity: 1, interview: false },
      { ci: 4, quota: 100, req: '热心公益，愿意奉献', beginner: true, intensity: 1, interview: false },
      { ci: 5, quota: 10, req: '有电路或编程基础，强烈动手能力', beginner: false, intensity: 5, interview: true },
      { ci: 6, quota: 8, req: '口齿清晰，思维敏捷', beginner: false, intensity: 4, interview: true },
      { ci: 7, quota: 25, req: '喜欢音乐，无需任何基础', beginner: true, intensity: 1, interview: false },
    ];
    for (const c of cfgs) {
      await this.configsRepo.save(this.configsRepo.create({
        clubId: clubs[c.ci].id, batchId: batch.id, quota: c.quota,
        requirements: c.req, acceptBeginner: c.beginner,
        assessmentIntensity: c.intensity, hasInterview: c.interview, status: 'published',
      }));
    }

    // ── 问卷题目 ──────────────────────────────────────
    await this.questionsRepo.save([
      {
        section: 'interest', sortOrder: 1, type: 'multi',
        question: '你最感兴趣的方向是哪些？（最多选3个）',
        options: [
          { value: 'art', label: '文艺创作（摄影、音乐、舞蹈、绘画）', tags: ['摄影','音乐','舞蹈','艺术','创意'] },
          { value: 'tech', label: '科技与编程（编程、机器人、电子）', tags: ['编程','机器人','科技','算法'] },
          { value: 'sports', label: '体育运动（球类、健身、户外）', tags: ['体育','羽毛球'] },
          { value: 'public', label: '公益与社会（志愿服务、支教）', tags: ['公益','志愿服务','奉献'] },
          { value: 'academia', label: '学术竞赛（辩论、演讲、学科竞赛）', tags: ['辩论','口才','逻辑思维','竞赛'] },
        ],
      },
      {
        section: 'time', sortOrder: 2, type: 'single',
        question: '你每周愿意为社团活动投入多少时间？',
        options: [
          { value: '1', label: '1-2小时（轻松参与）', tags: [] },
          { value: '2', label: '3-5小时（适中参与）', tags: [] },
          { value: '3', label: '6-10小时（深度参与）', tags: [] },
          { value: '4', label: '10小时以上（全力投入）', tags: [] },
        ],
      },
      {
        section: 'skill', sortOrder: 3, type: 'multi',
        question: '你有哪些技能或特长？',
        options: [
          { value: 'programming', label: '编程（任意语言）', tags: ['编程','C++','Python'] },
          { value: 'design', label: '设计/摄影/视频', tags: ['摄影','后期修图','创意'] },
          { value: 'music', label: '乐器或声乐', tags: ['音乐','吉他'] },
          { value: 'sports_skill', label: '体育专项技能', tags: ['体育','羽毛球'] },
          { value: 'speech', label: '演讲/辩论/主持', tags: ['口才','辩论','逻辑思维'] },
          { value: 'circuit', label: '电路/硬件/焊接', tags: ['电路','机器人'] },
          { value: 'none', label: '暂无特长，期待从零学习', tags: ['零基础可报'] },
        ],
      },
      {
        section: 'personality', sortOrder: 4, type: 'single',
        question: '你更偏向哪种社团氛围？',
        options: [
          { value: 'creative', label: '自由创作，注重个人发挥', tags: ['创意','艺术'] },
          { value: 'team', label: '团队协作，共同完成项目', tags: ['团队'] },
          { value: 'competitive', label: '挑战自我，参加竞赛', tags: ['竞赛'] },
          { value: 'service', label: '服务他人，回馈社会', tags: ['奉献','公益'] },
        ],
      },
      {
        section: 'goal', sortOrder: 5, type: 'multi',
        question: '你加入社团最主要的目标是什么？',
        options: [
          { value: 'friends', label: '结交朋友，扩大社交圈', tags: ['交友'] },
          { value: 'skill_up', label: '学习新技能，提升自己', tags: ['提升能力'] },
          { value: 'compete', label: '参加竞赛，拿到荣誉', tags: ['竞赛'] },
          { value: 'fun', label: '丰富课余生活，找到乐趣', tags: ['文艺','兴趣'] },
          { value: 'experience', label: '积累经历，充实简历', tags: ['实践'] },
        ],
      },
    ].map(q => this.questionsRepo.create(q as any)) as any);

    // ── 公告 ──────────────────────────────────────────
    await this.announcementsRepo.save([
      { title: '欢迎使用社团招新智能匹配平台', content: '2026年春季社团招新正式开始！请完成兴趣问卷，获取专属推荐，找到最适合你的社团。', isActive: true, sortOrder: 10, createdBy: admin.id },
      { title: '2026年春季招新时间安排', content: '报名截止日期：2026年4月30日。面试将在5月上旬进行，请保持关注平台通知。', isActive: true, sortOrder: 5, createdBy: admin.id },
    ].map(a => this.announcementsRepo.create(a)));
  }
}
