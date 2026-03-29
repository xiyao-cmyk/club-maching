-- 社团招新智能匹配平台 数据库初始化脚本
-- Character set: utf8mb4

CREATE DATABASE IF NOT EXISTS club_matching CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE club_matching;

-- =============================================
-- 用户表
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(128) NOT NULL UNIQUE,
  password    VARCHAR(256) NOT NULL,
  name        VARCHAR(64)  NOT NULL,
  avatar      VARCHAR(512),
  role        ENUM('student','club_admin','admin') NOT NULL DEFAULT 'student',
  phone       VARCHAR(20),
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 学生扩展画像
-- =============================================
CREATE TABLE IF NOT EXISTS student_profiles (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
  student_id          VARCHAR(32),
  school              VARCHAR(128),
  faculty             VARCHAR(128),
  major               VARCHAR(128),
  grade               TINYINT UNSIGNED COMMENT '年级 1-4',
  weekly_hours        TINYINT UNSIGNED COMMENT '每周可投入小时数',
  skills              JSON COMMENT '技能标签数组',
  personality_tags    JSON COMMENT '性格标签数组',
  goal_tags           JSON COMMENT '目标标签数组',
  interest_tags       JSON COMMENT '兴趣标签数组',
  questionnaire_done  TINYINT(1) NOT NULL DEFAULT 0,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 社团分类
-- =============================================
CREATE TABLE IF NOT EXISTS club_categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(64) NOT NULL,
  icon        VARCHAR(64),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 社团
-- =============================================
CREATE TABLE IF NOT EXISTS clubs (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(128) NOT NULL,
  category_id         INT UNSIGNED,
  logo                VARCHAR(512),
  cover               VARCHAR(512),
  slogan              VARCHAR(256),
  description         TEXT,
  founded_year        YEAR,
  member_count        INT UNSIGNED NOT NULL DEFAULT 0,
  activity_frequency  VARCHAR(64) COMMENT '活动频率，如"每周一次"',
  contact_email       VARCHAR(128),
  contact_qq          VARCHAR(32),
  status              ENUM('pending','active','inactive') NOT NULL DEFAULT 'pending',
  admin_user_id       BIGINT UNSIGNED COMMENT '社团管理员用户ID',
  view_count          INT UNSIGNED NOT NULL DEFAULT 0,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES club_categories(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 社团标签（多对多关联）
-- =============================================
CREATE TABLE IF NOT EXISTS club_tags (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  club_id     BIGINT UNSIGNED NOT NULL,
  tag         VARCHAR(32) NOT NULL,
  tag_type    ENUM('interest','skill','requirement','goal') NOT NULL DEFAULT 'interest',
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  INDEX idx_club (club_id),
  INDEX idx_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 招新批次（全校统一）
-- =============================================
CREATE TABLE IF NOT EXISTS recruitment_batches (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(128) NOT NULL COMMENT '如 "2026年春季招新"',
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  status        ENUM('upcoming','active','ended') NOT NULL DEFAULT 'upcoming',
  description   TEXT,
  created_by    BIGINT UNSIGNED,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 社团招新配置（每个社团每次批次的设置）
-- =============================================
CREATE TABLE IF NOT EXISTS club_recruitment_configs (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  club_id               BIGINT UNSIGNED NOT NULL,
  batch_id              BIGINT UNSIGNED NOT NULL,
  quota                 INT UNSIGNED COMMENT '招新名额，NULL表示不限',
  requirements          TEXT COMMENT '招新要求',
  skill_requirements    JSON COMMENT '技能要求标签',
  accept_beginner       TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否接受零基础',
  assessment_intensity  TINYINT UNSIGNED NOT NULL DEFAULT 2 COMMENT '考核强度 1-5',
  has_interview         TINYINT(1) NOT NULL DEFAULT 1,
  custom_questions      JSON COMMENT '报名表追加问题',
  status                ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id)  REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES recruitment_batches(id) ON DELETE CASCADE,
  UNIQUE KEY uk_club_batch (club_id, batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 问卷题目
-- =============================================
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section     ENUM('interest','time','skill','personality','goal') NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  question    VARCHAR(256) NOT NULL,
  type        ENUM('single','multi','scale') NOT NULL DEFAULT 'single',
  options     JSON COMMENT '选项数组 [{value, label, tags}]',
  is_active   TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 学生问卷答案
-- =============================================
CREATE TABLE IF NOT EXISTS questionnaire_answers (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  answers     JSON NOT NULL COMMENT '{question_id: answer_value}',
  completed   TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 报名申请
-- =============================================
CREATE TABLE IF NOT EXISTS applications (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  club_id     BIGINT UNSIGNED NOT NULL,
  batch_id    BIGINT UNSIGNED NOT NULL,
  priority    TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '志愿顺序',
  motivation  TEXT COMMENT '申请动机',
  custom_answers JSON COMMENT '附加问题的答案',
  status      ENUM('pending','reviewing','interview','admitted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  score       DECIMAL(5,2) COMMENT '社团给出的综合评分',
  remark      TEXT COMMENT '社团备注',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id)  REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES recruitment_batches(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_club_batch (user_id, club_id, batch_id),
  INDEX idx_club_batch (club_id, batch_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 面试安排
-- =============================================
CREATE TABLE IF NOT EXISTS interviews (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id  BIGINT UNSIGNED NOT NULL UNIQUE,
  interview_time  DATETIME NOT NULL,
  location        VARCHAR(256),
  online_link     VARCHAR(512),
  notes           TEXT,
  result          ENUM('pending','pass','fail') NOT NULL DEFAULT 'pending',
  feedback        TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 站内通知
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(128) NOT NULL,
  content     TEXT NOT NULL,
  type        ENUM('system','application','interview','result','announcement') NOT NULL DEFAULT 'system',
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  meta        JSON COMMENT '附加数据，如跳转链接等',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 用户行为日志（推荐算法输入）
-- =============================================
CREATE TABLE IF NOT EXISTS behavior_events (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  club_id     BIGINT UNSIGNED NOT NULL,
  event_type  ENUM('view','favorite','unfavorite','apply','cancel_apply','dwell') NOT NULL,
  duration_ms INT UNSIGNED COMMENT '停留时长（毫秒）',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  INDEX idx_user_club (user_id, club_id),
  INDEX idx_user_event (user_id, event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 收藏
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  user_id     BIGINT UNSIGNED NOT NULL,
  club_id     BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, club_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 公告
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(256) NOT NULL,
  content     TEXT NOT NULL,
  cover       VARCHAR(512),
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0,
  created_by  BIGINT UNSIGNED,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
