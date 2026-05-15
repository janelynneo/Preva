import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string;
  status: 'good' | 'below' | 'manageable';
  unit?: string;
}

function MetricCard({ title, value, status, unit }: MetricCardProps) {
  const statusColors = {
    good: '#22c55e',
    below: '#eab308',
    manageable: '#22c55e',
  };
  const statusLabels = {
    good: 'Good',
    below: 'Below',
    manageable: 'Manageable',
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      <View style={styles.metricStatus}>
        <View style={[styles.statusDot, { backgroundColor: statusColors[status] }]} />
        <Text style={[styles.statusLabel, { color: statusColors[status] }]}>
          {statusLabels[status]}
        </Text>
      </View>
    </View>
  );
}

export default function WeeklySummaryScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YOUR WEEK IN REVIEW</Text>
        <Text style={styles.subtitle}>March 10-16, 2025</Text>
        <Text style={styles.userInfo}>Alex's 3rd week</Text>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightLabel}>YOUR HIGHLIGHT</Text>
        <Text style={styles.highlightText}>
          Your deep sleep improved 15% this week!
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard title="Recovery" value="↑ 12%" status="good" />
        <MetricCard title="Sleep" value="85%" status="good" unit="avg" />
        <MetricCard title="Steps" value="7,2K" status="below" unit="avg" />
        <MetricCard title="Stress" value="3.2" status="manageable" unit="avg" />
      </View>

      <View style={styles.insightsCard}>
        <Text style={styles.insightText}>
          5 days met your activity baseline.
        </Text>
        <Text style={styles.insightText}>
          Most active: Tuesday (your pattern!)
        </Text>
        <Text style={styles.insightText}>
          Keep it up — your body is adapting.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mwiButton}
        onPress={() => navigation.navigate('MWI')}
      >
        <Text style={styles.mwiButtonText}>View My MWI</Text>
        <Text style={styles.mwiButtonArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3B3B',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#7dd3d3',
    marginTop: 8,
  },
  userInfo: {
    fontSize: 14,
    color: '#5bb8b8',
    marginTop: 4,
  },
  highlightCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D3B3B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  metricUnit: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 4,
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  insightsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  insightText: {
    fontSize: 15,
    color: '#b8e0e0',
    lineHeight: 24,
  },
  mwiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  mwiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mwiButtonArrow: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
});
