import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TeamService } from "../services/team";

const GOALS = [100000, 200000, 500000];

interface CreateTeamScreenProps {
  navigation: any;
}

export default function CreateTeamScreen({
  navigation,
}: CreateTeamScreenProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(200000);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    await TeamService.createTeam(name.trim(), goal);
    setLoading(false);
    navigation.navigate("Welcome");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create a Team</Text>
      <Text style={styles.subtitle}>
        Challenge your friends to hit collective wellness goals
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Team Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Raffles Walkers"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          maxLength={30}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Collective Step Goal</Text>
        <View style={styles.goalRow}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.goalOption, goal === g && styles.goalSelected]}
              onPress={() => setGoal(g)}
            >
              <Text
                style={[styles.goalNum, goal === g && styles.goalNumSelected]}
              >
                {(g / 1000).toLocaleString()}K
              </Text>
              <Text
                style={[
                  styles.goalLabel,
                  goal === g && styles.goalLabelSelected,
                ]}
              >
                steps
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={!name.trim() || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Team"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  goalRow: { flexDirection: "row", gap: 12 },
  goalOption: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalSelected: { borderColor: "#6366f1", backgroundColor: "#ede9fe" },
  goalNum: { fontSize: 20, fontWeight: "700", color: "#64748b" },
  goalNumSelected: { color: "#6366f1" },
  goalLabel: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  goalLabelSelected: { color: "#6366f1" },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: "#c7d2fe" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  backButton: { alignItems: "center", marginTop: 16, padding: 8 },
  backText: { color: "#94a3b8", fontSize: 16 },
});
