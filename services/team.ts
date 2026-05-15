import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TeamMember {
  name: string;
  steps: number;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  inviteCode: string;
  collectiveGoal: number;
  members: TeamMember[];
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
    const team: Team = {
      id: Date.now().toString(),
      name,
      inviteCode: generateCode(),
      collectiveGoal,
      members: [],
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));
    return team;
  },

  async joinTeam(inviteCode: string): Promise<Team | null> {
    // Mock join — any 6-char code creates a team for demo
    const team: Team = {
      id: Date.now().toString(),
      name: "Singapore Wellness Warriors",
      inviteCode,
      collectiveGoal: 500000,
      members: [
        { name: "Wei Lin", steps: 12340, avatar: "🩵" },
        { name: "Ravi", steps: 8900, avatar: "💪" },
        { name: "Mei Ling", steps: 15400, avatar: "🌿" },
      ],
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
    if (!team) return;
    team.members = team.members.map((m, i) => (i === 0 ? { ...m, steps } : m));
    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));
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
};
