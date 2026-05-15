import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface MWIScreenProps {
  navigation?: any;
}

export default function MWIScreen({ navigation }: MWIScreenProps) {
  const [expandedFAQ, setExpandedFAQ] = useState(false);

  // Mock data
  const mwiData = {
    tier: 2,
    tierLabel: 'Tier 2',
    tierColor: '#eab308',
    recoveryChange: 12,
    accuracy: 68,
    trendProgress: 45,
    recommendation:
      'Your metabolic wellness is progressing well. Focus on consistent sleep schedules and regular movement throughout the workday.',
    lastUpdated: 'Today at 7:23 AM',
  };

  const tiers = [
    {
      tier: 1,
      label: 'Tier 1',
      color: '#22c55e',
      name: 'Optimal',
      desc: 'Excellent metabolic function with high recovery capacity',
    },
    {
      tier: 2,
      label: 'Tier 2',
      color: '#eab308',
      name: 'Building',
      desc: 'Good metabolic health with room to optimize recovery',
    },
    {
      tier: 3,
      label: 'Tier 3',
      color: '#ef4444',
      name: 'Needs Attention',
      desc: 'Metabolic markers suggest prioritizing recovery and lifestyle changes',
    },
  ];

  const getTierEmoji = (tier: number) => {
    switch (tier) {
      case 1:
        return '🟢';
      case 2:
        return '🟡';
      case 3:
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your MWI</Text>
          <Text style={styles.lastUpdated}>{mwiData.lastUpdated}</Text>
        </View>

        {/* Tier Badge */}
        <View style={styles.tierCard}>
          <View
            style={[
              styles.tierBadge,
              { backgroundColor: mwiData.tierColor + '20' },
            ]}
          >
            <Text style={styles.tierEmoji}>{getTierEmoji(mwiData.tier)}</Text>
            <Text style={[styles.tierBadgeText, { color: mwiData.tierColor }]}>
              {mwiData.tierLabel}
            </Text>
          </View>
          <Text style={styles.tierName}>
            {tiers.find((t) => t.tier === mwiData.tier)?.name}
          </Text>
          <Text style={styles.tierDesc}>
            {tiers.find((t) => t.tier === mwiData.tier)?.desc}
          </Text>
        </View>

        {/* Recovery Change */}
        <View style={styles.recoveryCard}>
          <Text style={styles.recoveryLabel}>Recovery vs Last Week</Text>
          <View style={styles.recoveryValue}>
            <Text
              style={[
                styles.recoveryChange,
                mwiData.recoveryChange >= 0
                  ? styles.recoveryUp
                  : styles.recoveryDown,
              ]}
            >
              {mwiData.recoveryChange > 0 ? '↑' : '↓'}
              {Math.abs(mwiData.recoveryChange)}%
            </Text>
          </View>
        </View>

        {/* Accuracy Score */}
        <View style={styles.accuracyCard}>
          <View style={styles.accuracyHeader}>
            <Text style={styles.accuracyLabel}>MWI Accuracy</Text>
            <Text style={styles.accuracyValue}>{mwiData.accuracy}%</Text>
          </View>
          <View style={styles.accuracyBar}>
            <View style={[styles.accuracyBarFill, { width: `${mwiData.accuracy}%` }]} />
          </View>
          <Text style={styles.accuracyHint}>
            Connect more data sources to improve accuracy
          </Text>
          <View style={styles.accuracyPrompts}>
            <TouchableOpacity style={styles.accuracyPrompt}>
              <Text style={styles.accuracyPromptIcon}>⌚</Text>
              <Text style={styles.accuracyPromptText}>Connect wearable</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accuracyPrompt}>
              <Text style={styles.accuracyPromptIcon}>🩸</Text>
              <Text style={styles.accuracyPromptText}>Add blood test</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trend Progress */}
        <View style={styles.trendCard}>
          <Text style={styles.trendLabel}>Progress to Tier 1</Text>
          <View style={styles.trendBar}>
            <View
              style={[styles.trendBarFill, { width: `${mwiData.trendProgress}%` }]}
            />
          </View>
          <View style={styles.trendLabels}>
            <Text style={styles.trendMin}>Tier 3</Text>
            <Text style={styles.trendMax}>Tier 1</Text>
          </View>
        </View>

        {/* Recommendation */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationLabel}>Today's Recommendation</Text>
          <Text style={styles.recommendationText}>{mwiData.recommendation}</Text>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <TouchableOpacity
            style={styles.faqHeader}
            onPress={() => setExpandedFAQ(!expandedFAQ)}
          >
            <Text style={styles.faqTitle}>What are the tiers?</Text>
            <Text style={styles.faqArrow}>{expandedFAQ ? '−' : '+'}</Text>
          </TouchableOpacity>
          {expandedFAQ && (
            <View style={styles.faqContent}>
              {tiers.map((tier) => (
                <View key={tier.tier} style={styles.tierExplanation}>
                  <View style={styles.tierExplanationHeader}>
                    <Text style={styles.tierExplanationEmoji}>
                      {getTierEmoji(tier.tier)}
                    </Text>
                    <Text style={styles.tierExplanationLabel}>{tier.label}</Text>
                    <Text
                      style={[
                        styles.tierExplanationName,
                        { color: tier.color },
                      ]}
                    >
                      {tier.name}
                    </Text>
                  </View>
                  <Text style={styles.tierExplanationDesc}>{tier.desc}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3B3B',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#818cf8',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tierCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
  },
  tierEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  tierBadgeText: {
    fontSize: 20,
    fontWeight: '700',
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  tierDesc: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  recoveryCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e3a3a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recoveryLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  recoveryValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recoveryChange: {
    fontSize: 28,
    fontWeight: '700',
  },
  recoveryUp: {
    color: '#22c55e',
  },
  recoveryDown: {
    color: '#ef4444',
  },
  accuracyCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  accuracyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accuracyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D3B3B',
  },
  accuracyBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  accuracyBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  accuracyHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  accuracyPrompts: {
    flexDirection: 'row',
    gap: 12,
  },
  accuracyPrompt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 12,
  },
  accuracyPromptIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  accuracyPromptText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  trendCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  trendLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  trendBar: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 8,
  },
  trendBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendMin: {
    fontSize: 12,
    color: '#ef4444',
  },
  trendMax: {
    fontSize: 12,
    color: '#22c55e',
  },
  recommendationCard: {
    marginHorizontal: 20,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 15,
    color: '#78350f',
    lineHeight: 22,
  },
  faqSection: {
    marginHorizontal: 20,
    backgroundColor: '#1e3a3a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  faqArrow: {
    fontSize: 24,
    color: '#94a3b8',
  },
  faqContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tierExplanation: {
    marginBottom: 16,
  },
  tierExplanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierExplanationEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  tierExplanationLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginRight: 8,
  },
  tierExplanationName: {
    fontSize: 14,
    fontWeight: '600',
  },
  tierExplanationDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    marginLeft: 24,
  },
});
