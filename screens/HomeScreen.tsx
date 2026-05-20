import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  navigation?: any;
  daysSinceSignup?: number;
  userName?: string;
}

export default function HomeScreen({
  navigation,
  daysSinceSignup = 1,
  userName = "there",
}: HomeScreenProps) {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get day state based on days since signup
  const getDayState = () => {
    if (daysSinceSignup >= 30) return "full";
    if (daysSinceSignup >= 7) return "active";
    return "baseline";
  };

  const dayState = getDayState();

  // Mock data for active use state
  const recoveryData = {
    score: 7.2,
    hrv: 58,
    sleep: 82,
    steps: 6840,
    trend: "up",
  };

  const weatherRecommendation = {
    condition: "Humid",
    temperature: 31,
    recommendation:
      "Heat stress risk is high today. Prioritize hydration and take breaks in air-conditioned areas.",
    icon: "🌡️",
  };

  const baselineProgress = Math.min((daysSinceSignup / 7) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}, {userName}!
          </Text>
          <Text style={styles.dayCounter}>Day {daysSinceSignup} of 28</Text>
        </View>

        {/* State 1: Day 1-6 Baseline Building */}
        {dayState === "baseline" && (
          <>
            <View style={styles.baselineCard}>
              <View style={styles.baselineHeader}>
                <Text style={styles.baselineTitle}>Baseline Building</Text>
                <Text style={styles.baselineSubtitle}>
                  Tracking your unique metabolic patterns
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${baselineProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(baselineProgress)}% complete
                </Text>
              </View>
              <Text style={styles.baselineHint}>
                You're building your personal baseline. Keep logging daily!
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Tuesday Insight</Text>
              <Text style={styles.insightText}>
                Desk workers who take a 10-minute walk after lunch report 23%
                better afternoon energy levels.
              </Text>
              <TouchableOpacity style={styles.insightLink}>
                <Text style={styles.insightLinkText}>Read more</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* State 2 & 3: Active Use / Full MWI Active */}
        {(dayState === "active" || dayState === "full") && (
          <>
            {/* MWI Status Banner (Day 30+) */}
            {dayState === "full" && (
              <TouchableOpacity
                style={styles.mwiBanner}
                onPress={() => navigation?.navigate("MWI")}
              >
                <View style={styles.mwiBannerContent}>
                  <Text style={styles.mwiBannerLabel}>Your MWI is updated</Text>
                  <Text style={styles.mwiBannerValue}>Tier 2 🟡</Text>
                </View>
                <Text style={styles.mwiBannerArrow}>›</Text>
              </TouchableOpacity>
            )}

            {/* Recovery Card */}
            <View style={styles.recoveryCard}>
              <Text style={styles.cardTitle}>Recovery Status</Text>
              <View style={styles.recoveryStats}>
                <View style={styles.recoveryStat}>
                  <Text style={styles.recoveryValue}>{recoveryData.score}</Text>
                  <Text style={styles.recoveryLabel}>Score</Text>
                </View>
                <View style={styles.recoveryStat}>
                  <Text style={styles.recoveryValue}>{recoveryData.hrv}</Text>
                  <Text style={styles.recoveryLabel}>HRV</Text>
                </View>
                <View style={styles.recoveryStat}>
                  <Text style={styles.recoveryValue}>
                    {recoveryData.sleep}%
                  </Text>
                  <Text style={styles.recoveryLabel}>Sleep</Text>
                </View>
                <View style={styles.recoveryStat}>
                  <Text
                    style={[
                      styles.recoveryValue,
                      recoveryData.trend === "up"
                        ? styles.trendUp
                        : styles.trendDown,
                    ]}
                  >
                    {recoveryData.steps.toLocaleString()}
                  </Text>
                  <Text style={styles.recoveryLabel}>Steps</Text>
                </View>
              </View>
            </View>

            {/* Weather-Aware Recommendation */}
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationIcon}>
                  {weatherRecommendation.icon}
                </Text>
                <View style={styles.recommendationWeather}>
                  <Text style={styles.recommendationTemp}>
                    {weatherRecommendation.temperature}°C
                  </Text>
                  <Text style={styles.recommendationCondition}>
                    {weatherRecommendation.condition}
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationText}>
                {weatherRecommendation.recommendation}
              </Text>
              <View style={styles.recommendationTags}>
                <View style={styles.recommendationTag}>
                  <Text style={styles.recommendationTagText}>Hydration</Text>
                </View>
                <View style={styles.recommendationTag}>
                  <Text style={styles.recommendationTagText}>Breaks</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Evening Check-In CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={() => navigation?.navigate("CheckIn")}
        >
          <Text style={styles.checkInButtonText}>Evening Check-In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D3B3B",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  dayCounter: {
    fontSize: 16,
    color: "#94a3b8",
  },
  baselineCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  baselineHeader: {
    marginBottom: 16,
  },
  baselineTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  baselineSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
  },
  baselineHint: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  insightCard: {
    marginHorizontal: 20,
    backgroundColor: "#1e3a3a",
    borderRadius: 16,
    padding: 20,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 15,
    color: "#e2e8f0",
    lineHeight: 22,
    marginBottom: 12,
  },
  insightLink: {
    alignSelf: "flex-start",
  },
  insightLinkText: {
    fontSize: 14,
    color: "#818cf8",
    fontWeight: "500",
  },
  mwiBanner: {
    marginHorizontal: 20,
    backgroundColor: "#eab30820",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eab30840",
  },
  mwiBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mwiBannerLabel: {
    fontSize: 14,
    color: "#fef3c7",
  },
  mwiBannerValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eab308",
  },
  mwiBannerArrow: {
    fontSize: 24,
    color: "#eab308",
  },
  recoveryCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  recoveryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  recoveryStat: {
    alignItems: "center",
  },
  recoveryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0D3B3B",
    marginBottom: 4,
  },
  trendUp: {
    color: "#22c55e",
  },
  trendDown: {
    color: "#ef4444",
  },
  recoveryLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  recommendationCard: {
    marginHorizontal: 20,
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  recommendationWeather: {
    flex: 1,
  },
  recommendationTemp: {
    fontSize: 24,
    fontWeight: "700",
    color: "#92400e",
  },
  recommendationCondition: {
    fontSize: 14,
    color: "#b45309",
  },
  recommendationText: {
    fontSize: 15,
    color: "#78350f",
    lineHeight: 22,
    marginBottom: 12,
  },
  recommendationTags: {
    flexDirection: "row",
    gap: 8,
  },
  recommendationTag: {
    backgroundColor: "#fde68a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recommendationTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
  },
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#0D3B3B",
  },
  checkInButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  checkInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
