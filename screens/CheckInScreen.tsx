import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface CheckInScreenProps {
  navigation?: any;
}

export default function CheckInScreen({ navigation }: CheckInScreenProps) {
  const [step, setStep] = useState(1);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [soreness, setSoreness] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [hawkerMeals, setHawkerMeals] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 5;
  const canProceed =
    (step === 1 && sleepQuality > 0) ||
    (step === 2 && soreness !== null) ||
    (step === 3 && energyLevel > 0) ||
    (step === 4 && stressLevel > 0) ||
    step === 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Save check-in data
    setSubmitted(true);
  };

  const handleDone = () => {
    navigation?.navigate('Home');
  };

  // Render star rating
  const renderStars = (max: number, current: number, onSelect: (n: number) => void) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onSelect(n)} style={styles.starButton}>
          <Text style={[styles.star, n <= current && styles.starFilled]}>
            {n <= current ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render dot rating
  const renderDots = (max: number, current: number, onSelect: (n: number) => void) => (
    <View style={styles.dotsContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onSelect(n)}
          style={[styles.dot, n <= current && styles.dotFilled]}
        />
      ))}
    </View>
  );

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Check-in Complete!</Text>
          <View style={styles.streakCard}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>5 day streak!</Text>
          </View>
          <Text style={styles.personalizedMessage}>
            Based on your check-in, we recommend an early night tonight. Your
            energy levels suggest you could benefit from extra recovery time.
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Evening Check-In</Text>
          <Text style={styles.subtitle}>Question {step} of {totalSteps}</Text>
          <View style={styles.progress}>
            {[1, 2, 3, 4, 5].map((s) => (
              <View
                key={s}
                style={[styles.progressDot, s <= step && styles.progressDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Step 1: Sleep Quality */}
        {step === 1 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>How was your sleep last night?</Text>
            <Text style={styles.questionHint}>Rate your overall sleep quality</Text>
            {renderStars(5, sleepQuality, setSleepQuality)}
          </View>
        )}

        {/* Step 2: Soreness */}
        {step === 2 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>Any muscle soreness today?</Text>
            <Text style={styles.questionHint}>From desk work or activity</Text>
            <View style={styles.sorenessButtons}>
              {['None', 'Mild', 'Moderate', 'Severe'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.sorenessButton,
                    soreness === level && styles.sorenessButtonSelected,
                  ]}
                  onPress={() => setSoreness(level)}
                >
                  <Text
                    style={[
                      styles.sorenessButtonText,
                      soreness === level && styles.sorenessButtonTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Energy Level */}
        {step === 3 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>How's your energy level right now?</Text>
            <Text style={styles.questionHint}>How do you feel at the end of your day?</Text>
            {renderDots(5, energyLevel, setEnergyLevel)}
          </View>
        )}

        {/* Step 4: Stress Level */}
        {step === 4 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>How would you rate your stress today?</Text>
            <Text style={styles.questionHint}>Work and personal stress combined</Text>
            {renderDots(5, stressLevel, setStressLevel)}
          </View>
        )}

        {/* Step 5: Hawker Meals */}
        {step === 5 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>Hawker meals today?</Text>
            <Text style={styles.questionHint}>
              How many hawker center meals did you have?
            </Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setHawkerMeals(Math.max(0, hawkerMeals - 1))}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{hawkerMeals}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setHawkerMeals(hawkerMeals + 1)}
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !canProceed && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <Text style={styles.buttonText}>
              {step < totalSteps ? 'Continue' : 'Submit'}
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334d4d',
  },
  progressDotActive: {
    backgroundColor: '#6366f1',
  },
  questionCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  questionHint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#e2e8f0',
  },
  starFilled: {
    color: '#eab308',
  },
  sorenessButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sorenessButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  sorenessButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  sorenessButtonText: {
    fontSize: 15,
    color: '#334155',
  },
  sorenessButtonTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  dotFilled: {
    backgroundColor: '#6366f1',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D3B3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '500',
  },
  stepperValue: {
    minWidth: 60,
    alignItems: 'center',
  },
  stepperValueText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1e293b',
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4f46e5',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  streakIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
  },
  personalizedMessage: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  doneButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
