import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../entities/club.entity';
import { ClubRecruitmentConfig } from '../../entities/club-recruitment-config.entity';
import { StudentProfile } from '../../entities/student-profile.entity';
import { BehaviorEvent } from '../../entities/behavior-event.entity';
import { Announcement } from '../../entities/announcement.entity';

interface ScoredClub {
  club: Club;
  score: number;
  reasons: string[];
  config: ClubRecruitmentConfig | null;
}

/**
 * 智能推荐打分引擎
 *
 * 推荐分 = 兴趣匹配(40%) + 时间匹配(20%) + 技能匹配(20%) + 目标诉求(15%) + 热度修正(5%)
 */
@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Club)
    private clubsRepo: Repository<Club>,
    @InjectRepository(ClubRecruitmentConfig)
    private configsRepo: Repository<ClubRecruitmentConfig>,
    @InjectRepository(StudentProfile)
    private profilesRepo: Repository<StudentProfile>,
    @InjectRepository(BehaviorEvent)
    private behaviorRepo: Repository<BehaviorEvent>,
    @InjectRepository(Announcement)
    private announcementsRepo: Repository<Announcement>,
  ) {}

  async getRecommendations(userId: number, limit = 8): Promise<ScoredClub[]> {
    const profile = await this.profilesRepo.findOne({ where: { userId } });

    const clubs = await this.clubsRepo.find({
      where: { status: 'active' },
      relations: ['tags', 'category'],
    });

    const configs = await this.configsRepo.find({
      where: { status: 'published' },
    });
    const configMap = new Map<number, ClubRecruitmentConfig>();
    for (const c of configs) configMap.set(c.clubId, c);

    const behaviorEvents = await this.behaviorRepo.find({ where: { userId } });
    const viewedClubIds = new Set(behaviorEvents.map((e) => e.clubId));

    const maxViewCount = Math.max(...clubs.map((c) => c.viewCount), 1);

    const scored: ScoredClub[] = clubs.map((club) => {
      const config = configMap.get(club.id) ?? null;
      const { score, reasons } = this.scoreClub(club, config, profile, maxViewCount);
      return { club, score, reasons, config };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }

  private scoreClub(
    club: Club,
    config: ClubRecruitmentConfig | null,
    profile: StudentProfile | null,
    maxViewCount: number,
  ): { score: number; reasons: string[] } {
    if (!profile || !profile.questionnaireDone) {
      const popularityScore = (club.viewCount / maxViewCount) * 100;
      return {
        score: popularityScore,
        reasons: ['完成兴趣问卷后可获得专属推荐'],
      };
    }

    const reasons: string[] = [];
    let total = 0;

    // ── 1. 兴趣匹配 40% ──────────────────────────────
    const interestTags = profile.interestTags ?? [];
    const clubInterestTags = club.tags?.filter((t) => t.tagType === 'interest').map((t) => t.tag) ?? [];
    const interestMatch = this.jaccardSimilarity(interestTags, clubInterestTags);
    const interestScore = interestMatch * 100 * 0.4;
    total += interestScore;

    if (interestMatch > 0.3) {
      const matched = interestTags.filter((t) => clubInterestTags.includes(t)).slice(0, 3);
      reasons.push(`你对 ${matched.join('、')} 感兴趣，与该社团高度匹配`);
    }

    // ── 2. 时间投入匹配 20% ───────────────────────────
    const weeklyHours = profile.weeklyHours ?? 0;
    let timeScore = 0;
    if (config) {
      const intensity = config.assessmentIntensity; // 1-5
      const requiredHours = intensity * 2;
      const diff = Math.abs(weeklyHours - requiredHours);
      timeScore = Math.max(0, 100 - diff * 15) * 0.2;
      total += timeScore;
      if (diff <= 2) {
        reasons.push(`你每周可投入约 ${weeklyHours} 小时，与该社团活动强度匹配`);
      }
    } else {
      total += 10; // 无配置给默认分
    }

    // ── 3. 技能/要求匹配 20% ──────────────────────────
    const skills = profile.skills ?? [];
    const clubSkillTags = club.tags?.filter((t) => t.tagType === 'skill').map((t) => t.tag) ?? [];
    const skillRequired = config?.skillRequirements ?? [];

    let skillScore = 0;
    if (config?.acceptBeginner && skills.includes('零基础可报')) {
      skillScore = 60 * 0.2;
      reasons.push('该社团欢迎零基础同学，适合你入门');
    } else if (clubSkillTags.length > 0 || skillRequired.length > 0) {
      const allRequired = [...new Set([...clubSkillTags, ...skillRequired])];
      const skillMatch = this.jaccardSimilarity(skills, allRequired);
      skillScore = skillMatch * 100 * 0.2;
      if (skillMatch > 0.3) {
        const matched = skills.filter((s) => allRequired.includes(s)).slice(0, 2);
        reasons.push(`你的 ${matched.join('、')} 技能符合该社团要求`);
      }
    } else {
      skillScore = 50 * 0.2;
    }
    total += skillScore;

    // ── 4. 目标诉求匹配 15% ───────────────────────────
    const goalTags = profile.goalTags ?? [];
    const clubGoalTags = club.tags?.filter((t) => t.tagType === 'goal').map((t) => t.tag) ?? [];
    const goalMatch = this.jaccardSimilarity(goalTags, clubGoalTags);
    const goalScore = goalMatch * 100 * 0.15;
    total += goalScore;

    if (goalMatch > 0.3) {
      reasons.push('该社团与你的参与目标高度契合');
    }

    // ── 5. 热度修正 5% ────────────────────────────────
    const popularityScore = (club.viewCount / maxViewCount) * 100 * 0.05;
    total += popularityScore;

    if (reasons.length === 0) {
      reasons.push(`${club.category?.name ?? '综合'}类社团，可能适合你`);
    }

    return { score: Math.min(Math.round(total), 100), reasons };
  }

  private jaccardSimilarity(a: string[], b: string[]): number {
    if (a.length === 0 && b.length === 0) return 0;
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = [...setA].filter((x) => setB.has(x)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  async getAnnouncements() {
    return this.announcementsRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'DESC', createdAt: 'DESC' },
      take: 5,
    });
  }

  async getStats() {
    const totalClubs = await this.clubsRepo.count({ where: { status: 'active' } });
    return { totalClubs };
  }
}
