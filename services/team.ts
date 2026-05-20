import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TeamMember {
  id: string;
  name: string;
  steps: number;
  weeklySteps: number[];
  joinedAt: string;
  avatar: string;
  streak: number;
  lastActive: string;
}

export interface TeamChallenge {
  id: string;
  type: "steps" | "checkin" | "sleep";
  title: string;
  description: string;
  goal: number;
  current: number;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface Team {
  id: string;
  name: string;
  inviteCode: string;
  collectiveGoal: number;
  members: TeamMember[];
  challenges: TeamChallenge[];
  weeklyGoal: number;
  createdAt: number;
}

const TEAM_KEY = "metabo_team";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function generateWeeklySteps(base: number, variation: number): number[] {
  return Array.from({ length: 7 }, (_, i) =>
    Math.round(base + (Math.random() - 0.5) * variation),
  );
}

const MOCK_TEAMS: Record<string, Omit<Team, "id" | "createdAt">> = {
  SG_WELLNESS_WARRIORS: {
    name: "SG Wellness Warriors",
    inviteCode: "SGWW01",
    collectiveGoal: 500000,
    weeklyGoal: 100000,
    members: [
      {
        id: "m1",
        name: "Wei Lin",
        steps: 8742,
        weeklySteps: generateWeeklySteps(8200, 1500),
        joinedAt: daysAgo(30),
        avatar: "🩵",
        streak: 14,
        lastActive: today(),
      },
      {
        id: "m2",
        name: "Ravi Kumar",
        steps: 12340,
        weeklySteps: generateWeeklySteps(11500, 2000),
        joinedAt: daysAgo(28),
        avatar: "💪",
        streak: 7,
        lastActive: today(),
      },
      {
        id: "m3",
        name: "Mei Ling",
        steps: 6503,
        weeklySteps: generateWeeklySteps(6000, 1800),
        joinedAt: daysAgo(21),
        avatar: "🌿",
        streak: 3,
        lastActive: daysAgo(1),
      },
      {
        id: "m4",
        name: "Darren Tan",
        steps: 9108,
        weeklySteps: generateWeeklySteps(8700, 1200),
        joinedAt: daysAgo(14),
        avatar: "⚡",
        streak: 9,
        lastActive: today(),
      },
      {
        id: "m5",
        name: "Aisha Binte",
        steps: 7821,
        weeklySteps: generateWeeklySteps(7500, 1400),
        joinedAt: daysAgo(7),
        avatar: "🌺",
        streak: 5,
        lastActive: today(),
      },
    ],
    challenges: [
      {
        id: "c1",
        type: "steps",
        title: "Raffle Place Climb",
        description:
          "Collective goal: walk the equivalent of 58 flights of stairs at Raffles Place MRT",
        goal: 50000,
        current: 38700,
        startDate: daysAgo(4),
        endDate: daysAgo(1),
        completed: false,
      },
      {
        id: "c2",
        type: "checkin",
        title: "Balanced Eating Week",
        description:
          "Every member logs at least one healthy meal a day for a week",
        goal: 7,
        current: 7,
        startDate: daysAgo(7),
        endDate: today(),
        completed: true,
      },
      {
        id: "c3",
        type: "sleep",
        title: "8-Hour Weekend Challenge",
        description:
          "At least 4 members get 8+ hours of sleep on both Saturday and Sunday",
        goal: 8,
        current: 6,
        startDate: daysAgo(2),
        endDate: daysAgo(0),
        completed: false,
      },
    ],
  },
  MARKET_MAVENS: {
    name: "Market Mavens",
    inviteCode: "MMAVEN1",
    collectiveGoal: 300000,
    weeklyGoal: 60000,
    members: [
      {
        id: "m1",
        name: "Jia Jun",
        steps: 5430,
        weeklySteps: generateWeeklySteps(5100, 900),
        joinedAt: daysAgo(45),
        avatar: "🍜",
        streak: 21,
        lastActive: today(),
      },
      {
        id: "m2",
        name: "Priya",
        steps: 9876,
        weeklySteps: generateWeeklySteps(9200, 1500),
        joinedAt: daysAgo(40),
        avatar: "🥗",
        streak: 18,
        lastActive: today(),
      },
      {
        id: "m3",
        name: "Firdaus",
        steps: 7102,
        weeklySteps: generateWeeklySteps(6800, 1100),
        joinedAt: daysAgo(30),
        avatar: "🏃",
        streak: 10,
        lastActive: daysAgo(2),
      },
    ],
    challenges: [
      {
        id: "c1",
        type: "steps",
        title: "Marina Mile",
        description:
          "Walk the full Marina Bay Sands to Gardens by the Bay path (3.2km)",
        goal: 16000,
        current: 16000,
        startDate: daysAgo(5),
        endDate: daysAgo(2),
        completed: true,
      },
    ],
  },
};

export const TeamService = {
  async getTeam(): Promise<Team | null> {
    try {
      const data = await AsyncStorage.getItem(TEAM_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async createTeam(name: string, collectiveGoal: number): Promise<Team> {
    const existingCodes = Object.keys(MOCK_TEAMS);
    const randomTeamKey =
      existingCodes[Math.floor(Math.random() * existingCodes.length)];
    const template = MOCK_TEAMS[randomTeamKey];

    const team: Team = {
      ...template,
      id: Date.now().toString(),
      name,
      inviteCode: generateCode(),
      collectiveGoal,
      members: template.members,
      challenges: template.challenges,
      weeklyGoal: Math.round(collectiveGoal / 5),
      createdAt: Date.now(),
    };

    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));
    return team;
  },

  async joinTeam(inviteCode: string): Promise<Team | null> {
    const normalised = inviteCode.toUpperCase().trim();
    const match = Object.values(MOCK_TEAMS).find(
      (t) => t.inviteCode === normalised,
    );
    if (!match) return null;

    const team: Team = {
      ...match,
      id: Date.now().toString(),
      inviteCode: normalised,
      createdAt: Date.now(),
    };

    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));
    return team;
  },

  async leaveTeam(): Promise<void> {
    await AsyncStorage.removeItem(TEAM_KEY);
  },

  async updateMySteps(steps: number): Promise<void> {
    const team = await this.getTeam();
    if (!team || team.members.length === 0) return;
    // Update the "first" member (the current user's slot)
    const updated = {
      ...team,
      members: [
        { ...team.members[0], steps, lastActive: today() },
        ...team.members.slice(1),
      ],
    };
    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(updated));
  },

  async getTeamProgress(): Promise<{
    current: number;
    goal: number;
    percent: number;
  }> {
    const team = await this.getTeam();
    if (!team) return { current: 0, goal: 0, percent: 0 };
    const current = team.members.reduce((s, m) => s + m.steps, 0);
    const goal = team.collectiveGoal;
    const percent = Math.min(100, Math.round((current / goal) * 100));
    return { current, goal, percent };
  },

  async getWeeklyProgress(): Promise<{
    current: number;
    goal: number;
    percent: number;
    daysLeft: number;
  }> {
    const team = await this.getTeam();
    if (!team) return { current: 0, goal: 0, percent: 0, daysLeft: 0 };
    const weeklyCurrent = team.members.reduce(
      (s, m) => s + m.weeklySteps.reduce((a, b) => a + b, 0),
      0,
    );
    const goal = team.weeklyGoal;
    const todayDayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
    const daysLeft = todayDayOfWeek === 0 ? 0 : 7 - todayDayOfWeek;
    const percent = Math.min(100, Math.round((weeklyCurrent / goal) * 100));
    return { current: weeklyCurrent, goal, percent, daysLeft };
  },

  async getActiveChallenges(): Promise<TeamChallenge[]> {
    const team = await this.getTeam();
    if (!team) return [];
    return team.challenges.filter((c) => !c.completed);
  },

  async getCompletedChallenges(): Promise<TeamChallenge[]> {
    const team = await this.getTeam();
    if (!team) return [];
    return team.challenges.filter((c) => c.completed);
  },

  async getMemberRankings(): Promise<TeamMember[]> {
    const team = await this.getTeam();
    if (!team) return [];
    return [...team.members].sort((a, b) => b.steps - a.steps);
  },
};
