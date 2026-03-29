USE club_matching;

-- =============================================
-- 初始用户（密码均为 Admin123! 的 bcrypt hash）
-- =============================================
INSERT INTO users (email, password, name, role) VALUES
('admin@test.com',   '$2b$10$4rs95QtPZJ9eIeC3RqsT5O.nKBMW8HShiqFCHbUaHA/rIeEyNfVwK', '系统管理员', 'admin'),
('club@test.com',    '$2b$10$4rs95QtPZJ9eIeC3RqsT5O.nKBMW8HShiqFCHbUaHA/rIeEyNfVwK', '摄影社社长', 'club_admin'),
('student@test.com', '$2b$10$4rs95QtPZJ9eIeC3RqsT5O.nKBMW8HShiqFCHbUaHA/rIeEyNfVwK', '张同学', 'student');

-- 学生画像
INSERT INTO student_profiles (user_id, school, faculty, major, grade) VALUES
(3, '示例大学', '计算机学院', '软件工程', 1);

-- =============================================
-- 社团分类
-- =============================================
INSERT INTO club_categories (name, icon, sort_order) VALUES
('文艺类', 'music', 10),
('体育类', 'trophy', 20),
('学术类', 'book', 30),
('科技类', 'cpu', 40),
('公益类', 'heart', 50),
('实践类', 'briefcase', 60);

-- =============================================
-- 示例社团
-- =============================================
INSERT INTO clubs (name, category_id, slogan, description, founded_year, member_count, activity_frequency, contact_email, status, admin_user_id) VALUES
('摄影协会', 1, '用镜头记录青春', '摄影协会成立于2010年，是校内最具活力的摄影爱好者团体。我们定期组织外拍活动、摄影展、技术分享等。无论你是零基础小白还是摄影达人，都欢迎加入。', 2010, 120, '每两周一次活动', 'photo@club.edu', 'active', 2),
('编程与算法社', 4, '代码改变世界', '专注于算法竞赛、编程技能提升和项目实战。定期举办算法讲座、Hackathon 和 ACM/ICPC 备赛培训。', 2015, 85, '每周一次例会', 'code@club.edu', 'active', NULL),
('街舞社', 1, 'Dance for Life', '街舞社涵盖 Breaking、Popping、Locking、Hip-Hop 多种风格，每学期参加校内外比赛，欢迎有舞蹈基础的同学加入。', 2012, 60, '每周三次训练', 'dance@club.edu', 'active', NULL),
('羽毛球协会', 2, '羽动青春', '提供专业场地和训练指导，定期组织校内联赛，代表学校参加市级比赛。', 2008, 200, '每天开放练习', 'badminton@club.edu', 'active', NULL),
('志愿者协会', 5, '奉献爱心，服务社会', '组织各类公益活动，包括支教、社区服务、环保行动等，荣获省级优秀志愿服务组织。', 2005, 350, '每月多次活动', 'volunteer@club.edu', 'active', NULL),
('机器人社', 4, '创造未来', '参与各类机器人竞赛，如 RoboMaster、RoboCom 等，配备专业实验室和设备。', 2016, 45, '每周两次项目推进', 'robot@club.edu', 'active', NULL),
('辩论队', 3, '言之有物，论之有据', '校级辩论冠军队，提供系统辩论训练，参加全国高校辩论赛。', 2003, 30, '每周两次', 'debate@club.edu', 'active', NULL),
('吉他社', 1, '弦动心弦', '从零基础到进阶，系统学习吉他，每学期举办音乐会。', 2011, 70, '每周一次', 'guitar@club.edu', 'active', NULL);

-- 社团标签
INSERT INTO club_tags (club_id, tag, tag_type) VALUES
(1, '摄影', 'interest'), (1, '艺术', 'interest'), (1, '创意', 'interest'), (1, '后期修图', 'skill'), (1, '零基础可报', 'requirement'),
(2, '编程', 'interest'), (2, '算法', 'interest'), (2, 'C++', 'skill'), (2, 'Python', 'skill'), (2, '竞赛', 'goal'),
(3, '舞蹈', 'interest'), (3, '街舞', 'interest'), (3, '表演', 'goal'), (3, '有基础优先', 'requirement'),
(4, '体育', 'interest'), (4, '羽毛球', 'interest'), (4, '零基础可报', 'requirement'),
(5, '公益', 'interest'), (5, '志愿服务', 'interest'), (5, '奉献', 'goal'), (5, '零基础可报', 'requirement'),
(6, '机器人', 'interest'), (6, '电路', 'skill'), (6, '编程', 'skill'), (6, '竞赛', 'goal'),
(7, '辩论', 'interest'), (7, '口才', 'skill'), (7, '逻辑思维', 'skill'), (7, '竞赛', 'goal'),
(8, '音乐', 'interest'), (8, '吉他', 'interest'), (8, '零基础可报', 'requirement'), (8, '表演', 'goal');

-- =============================================
-- 招新批次
-- =============================================
INSERT INTO recruitment_batches (name, start_date, end_date, status, description, created_by) VALUES
('2026年春季招新', '2026-03-01', '2026-04-30', 'active', '2026年春季学期社团招新，欢迎所有新生踊跃报名！', 1);

-- 社团招新配置
INSERT INTO club_recruitment_configs (club_id, batch_id, quota, requirements, skill_requirements, accept_beginner, assessment_intensity, has_interview, status) VALUES
(1, 1, 30, '对摄影感兴趣，有相机或愿意借用社团相机，积极参与活动', '["摄影基础"]', 1, 2, 0, 'published'),
(2, 1, 20, '热爱编程，有一定代码基础，愿意投入时间训练算法', '["C++","Python","Java"]', 0, 4, 1, 'published'),
(3, 1, 15, '有舞蹈基础优先，热爱街舞文化，能保证每周训练时间', '["舞蹈基础"]', 0, 3, 1, 'published'),
(4, 1, 50, '喜欢羽毛球运动，无基础要求', NULL, 1, 1, 0, 'published'),
(5, 1, 100, '热心公益，愿意奉献时间服务社会', NULL, 1, 1, 0, 'published'),
(6, 1, 10, '有电路或编程基础，强烈的动手能力，愿意参加竞赛', '["C++","电路基础"]', 0, 5, 1, 'published'),
(7, 1, 8, '口齿清晰，思维敏捷，有辩论或演讲经历优先', '["口才"]', 0, 4, 1, 'published'),
(8, 1, 25, '喜欢音乐，无需任何基础，从零开始教学', NULL, 1, 1, 0, 'published');

-- =============================================
-- 兴趣问卷题目
-- =============================================
INSERT INTO questionnaire_questions (section, sort_order, question, type, options) VALUES
-- 兴趣方向
('interest', 1, '你最感兴趣的方向是哪些？（最多选3个）', 'multi',
 '[{"value":"art","label":"文艺创作（摄影、音乐、舞蹈、绘画）","tags":["摄影","音乐","舞蹈","艺术","创意"]},{"value":"tech","label":"科技与编程（编程、机器人、电子）","tags":["编程","机器人","科技","算法"]},{"value":"sports","label":"体育运动（球类、健身、户外）","tags":["体育","羽毛球","篮球"]},{"value":"public","label":"公益与社会（志愿服务、支教）","tags":["公益","志愿服务","奉献"]},{"value":"academia","label":"学术竞赛（辩论、演讲、学科竞赛）","tags":["辩论","口才","逻辑思维","竞赛"]}]'),
-- 时间投入
('time', 2, '你每周愿意为社团活动投入多少时间？', 'single',
 '[{"value":"1","label":"1-2小时（轻松参与）","tags":[]},{"value":"2","label":"3-5小时（适中参与）","tags":[]},{"value":"3","label":"6-10小时（深度参与）","tags":[]},{"value":"4","label":"10小时以上（全力投入）","tags":[]}]'),
-- 技能特长
('skill', 3, '你有哪些技能或特长？', 'multi',
 '[{"value":"programming","label":"编程（任意语言）","tags":["编程","C++","Python","Java"]},{"value":"design","label":"设计/摄影/视频","tags":["摄影","后期修图","创意"]},{"value":"music","label":"乐器或声乐","tags":["音乐","吉他"]},{"value":"sports_skill","label":"体育专项技能","tags":["体育","羽毛球"]},{"value":"speech","label":"演讲/辩论/主持","tags":["口才","辩论","逻辑思维"]},{"value":"circuit","label":"电路/硬件/焊接","tags":["电路基础","机器人"]},{"value":"none","label":"暂无特长，期待从零学习","tags":["零基础可报"]}]'),
-- 性格偏好
('personality', 4, '你更偏向哪种社团氛围？', 'single',
 '[{"value":"creative","label":"自由创作，注重个人发挥","tags":["创意","艺术"]},{"value":"team","label":"团队协作，共同完成项目","tags":["团队"]},{"value":"competitive","label":"挑战自我，参加竞赛","tags":["竞赛"]},{"value":"service","label":"服务他人，回馈社会","tags":["奉献","公益"]}]'),
-- 参加目标
('goal', 5, '你加入社团最主要的目标是什么？', 'multi',
 '[{"value":"friends","label":"结交朋友，扩大社交圈","tags":["交友"]},{"value":"skill_up","label":"学习新技能，提升自己","tags":["提升能力"]},{"value":"compete","label":"参加竞赛，拿到荣誉","tags":["竞赛"]},{"value":"fun","label":"丰富课余生活，找到乐趣","tags":["文艺","兴趣"]},{"value":"experience","label":"积累经历，充实简历","tags":["实践"]}]');

-- =============================================
-- 公告
-- =============================================
INSERT INTO announcements (title, content, is_active, sort_order, created_by) VALUES
('欢迎使用社团招新智能匹配平台', '亲爱的同学们，2026年春季社团招新正式开始！请完成兴趣问卷，获取专属推荐，找到最适合你的社团。', 1, 10, 1),
('2026年春季招新时间安排', '报名截止日期：2026年4月30日。面试将在5月上旬进行，请保持关注平台通知。', 1, 5, 1);
