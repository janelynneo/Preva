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

interface JoinTeamScreenProps {
  navigation: any;
}

export default function JoinTeamScreen({ navigation }: JoinTeamScreenProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    if (code.length < 6) {
      setError("Enter a 6-character invite code");
      return;
    }
    setLoading(true);
    setError("");
    const team = await TeamService.joinTeam(code.toUpperCase());
    setLoading(false);
    if (team) {
      navigation.navigate("Welcome");
    } else {
      setError("Invalid invite code. Try again.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Join a Team</Text>
      <Text style={styles.subtitle}>
        Enter the invite code shared by your team leader
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Invite Code</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="ABC123"
          placeholderTextColor="#94a3b8"
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase().replace(/[^A-Z0-9]/g, ""));
            setError("");
          }}
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.hint}>
          Ask your team leader for the 6-character code
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, code.length < 6 && styles.buttonDisabled]}
        onPress={handleJoin}
        disabled={code.length < 6 || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Joining..." : "Join Team"}
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 8,
  },
  inputError: { borderWidth: 2, borderColor: "#ef4444" },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  hint: { fontSize: 13, color: "#94a3b8", marginTop: 12, textAlign: "center" },
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
