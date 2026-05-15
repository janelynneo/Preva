import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Mock user data
  const [userData] = useState({
    name: 'Wei',
    ageRange: '31-35',
    goal: 'energy',
    notifications: {
      morning: true,
      evening: true,
      weekly: false,
    },
    dataSharing: {
      wearable: true,
      bloodTest: false,
    },
    contextScore: 72,
  });

  const goalLabels: Record<string, string> = {
    energy: '⚡ Energy',
    sleep: '😴 Sleep',
    stress: '🧘 Stress',
    activity: '🏃 Activity',
  };

  const contextBreakdown = [
    { label: 'Sleep data', value: 100, icon: '😴' },
    { label: 'Recovery scores', value: 85, icon: '📊' },
    { label: 'Activity tracking', value: 60, icon: '🏃' },
    { label: ' Hawker meals', value: 45, icon: '🍜' },
  ];

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://metabo.health/privacy');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {userData.name === 'I prefer to stay anonymous'
                  ? 'Anonymous'
                  : userData.name}
              </Text>
              <Text style={styles.userMeta}>
                {userData.ageRange} years old • {goalLabels[userData.goal]}
              </Text>
            </View>
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Morning briefing</Text>
                <Text style={styles.settingDesc}>7:00 AM daily</Text>
              </View>
              <Switch
                value={userData.notifications.morning}
                onValueChange={() => {}}
                trackColor={{ false: '#334d4d', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Evening check-in</Text>
                <Text style={styles.settingDesc}>8:00 PM daily</Text>
              </View>
              <Switch
                value={userData.notifications.evening}
                onValueChange={() => {}}
                trackColor={{ false: '#334d4d', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weekly summary</Text>
                <Text style={styles.settingDesc}>Every Sunday</Text>
              </View>
              <Switch
                value={userData.notifications.weekly}
                onValueChange={() => {}}
                trackColor={{ false: '#334d4d', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Wearable device</Text>
                <Text style={styles.settingDesc}>Apple Health / Google Fit</Text>
              </View>
              <Switch
                value={userData.dataSharing.wearable}
                onValueChange={() => {}}
                trackColor={{ false: '#334d4d', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Blood test results</Text>
                <Text style={styles.settingDesc}>Lab results integration</Text>
              </View>
              <Switch
                value={userData.dataSharing.bloodTest}
                onValueChange={() => {}}
                trackColor={{ false: '#334d4d', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Context Completeness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context Completeness</Text>
          <View style={styles.card}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreValue}>{userData.contextScore}%</Text>
              <Text style={styles.scoreLabel}>complete</Text>
            </View>
            <View style={styles.scoreBar}>
              <View
                style={[styles.scoreBarFill, { width: `${userData.contextScore}%` }]}
              />
            </View>
            <Text style={styles.scoreHint}>
              More context improves your MWI accuracy
            </Text>
            <View style={styles.contextBreakdown}>
              {contextBreakdown.map((item, index) => (
                <View key={index} style={styles.contextItem}>
                  <Text style={styles.contextIcon}>{item.icon}</Text>
                  <Text style={styles.contextLabel}>{item.label}</Text>
                  <View style={styles.contextBar}>
                    <View
                      style={[styles.contextBarFill, { width: `${item.value}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Privacy & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Legal</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Data Export</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This app is not a medical device. Consult your doctor for medical
            advice.
          </Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    color: '#64748b',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: '#94a3b8',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D3B3B',
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  scoreHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  contextBreakdown: {
    gap: 12,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextIcon: {
    fontSize: 16,
    width: 28,
  },
  contextLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 100,
  },
  contextBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  contextBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 16,
    color: '#1e293b',
  },
  linkArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  disclaimer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
