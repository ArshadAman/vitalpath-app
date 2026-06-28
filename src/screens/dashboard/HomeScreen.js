import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

// Import child views
import DashboardTab from './DashboardTab';
import TimelineScreen from '../timeline/TimelineScreen';
import VoiceJournalScreen from '../voice/VoiceJournalScreen';
import GoalsScreen from '../goals/GoalsScreen';
import ProfileSetupScreen from '../profile/ProfileSetupScreen';
import OCRVerificationScreen from '../reports/OCRVerificationScreen';
import OnboardingIntroScreen from '../onboarding/OnboardingIntroScreen';

export default function HomeScreen({ setToken }) {
  const [activeTab, setActiveTab] = useState('Dashboard'); // 'Dashboard', 'Timeline', 'Journal', 'Goals'
  
  // Modals / Sub-flows state
  const [showIntro, setShowIntro] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(true);
  const [showOCRVerification, setShowOCRVerification] = useState(false);
  
  // Shared mock databases
  const [profileData, setProfileData] = useState(null);
  
  const [simulatedLocation, setSimulatedLocation] = useState('Gym'); // 'Gym' or 'Tobacco Shop'
  
  const [timelineEntries, setTimelineEntries] = useState([
    {
      title: "Lab Blood Panel Checked",
      category: "reports",
      description: "Verified OCR extraction. HbA1c: 5.7%, Cholesterol: 192 mg/dL, BP: 118/79 mmHg.",
      value: "HbA1c: 5.7%",
      timestamp: "Yesterday 4:30 PM",
      scoreChange: 4
    },
    {
      title: "Cardio Workout (Gold's Gym)",
      category: "vitals",
      description: "Workout confirmed via geofence engine. 45 min core session logged.",
      value: "45 min",
      timestamp: "Yesterday 9:15 AM",
      scoreChange: 2
    },
    {
      title: "Tobacco Intake (Voice Log)",
      category: "logs",
      description: "Voice transcript: 'I smoked two cigarettes after lunch.'",
      value: "2 counts",
      timestamp: "2 days ago",
      scoreChange: -6
    }
  ]);

  const [goals, setGoals] = useState([
    {
      title: "Daily Steps Walk",
      current: "6,500",
      target: "10,000",
      progress: 65,
      streak: 5,
      category: "activity"
    },
    {
      title: "No Tobacco Consumption",
      current: "1",
      target: "1",
      progress: 100,
      streak: 8,
      category: "habit"
    }
  ]);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const handleTabChange = (tab) => {
    triggerHaptic();
    setActiveTab(tab);
  };

  // Handler helpers
  const handleFinishIntro = (dontShowAgainSetting) => {
    setShowIntro(false);
    if (dontShowAgainSetting) {
      console.log("Intro onboarding skip preference saved.");
    }
  };

  const handleSaveProfile = (data) => {
    setProfileData(data);
    setShowProfileSetup(false);
    
    // Add timeline log registering onboarding profile calibration
    addLogEntry({
      title: "Preventive Engine Calibrated",
      category: "goals",
      description: `Health profile successfully set up. Base parameters: Age ${data.age}, Gender: ${data.gender}, BMI Weight ${data.weight}kg, Water Target: ${data.waterTarget}ml, Sleep Target: ${data.sleepTarget}h.`,
      timestamp: "Just Now",
      scoreChange: 5
    });
  };

  const addLogEntry = (newEntry) => {
    setTimelineEntries((prev) => [newEntry, ...prev]);
  };

  const handleAddGoal = (newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
    
    // Add timeline log registering new goal activation
    addLogEntry({
      title: `Goal Set: ${newGoal.title}`,
      category: "goals",
      description: `New preventive target set up: Reach ${newGoal.target} in health category.`,
      timestamp: "Just Now",
      scoreChange: 1
    });
  };

  const handleConfirmOCR = (ocrLogEntry) => {
    addLogEntry(ocrLogEntry);
    setShowOCRVerification(false);
    setActiveTab('Timeline');
  };

  const triggerLocationSim = () => {
    const nextLoc = simulatedLocation === 'Gym' ? 'Tobacco Shop' : 'Gym';
    setSimulatedLocation(nextLoc);
    setActiveTab('Dashboard');
    Alert.alert(
      'Location Simulation',
      `You traveled to: ${nextLoc === 'Gym' ? 'Gold\'s Gym (Health Hub)' : 'Smoke Plaza (Dwell Zone)'}`
    );
  };

  // Render helpers
  const renderActiveView = () => {
    switch (activeTab) {
      case 'Timeline':
        return (
          <TimelineScreen 
            timelineEntries={timelineEntries} 
            onUploadPress={() => { triggerHaptic(); setShowOCRVerification(true); }} 
          />
        );
      case 'Journal':
        return (
          <VoiceJournalScreen 
            addLogEntry={addLogEntry} 
          />
        );
      case 'Goals':
        return (
          <GoalsScreen 
            goals={goals} 
            onAddGoal={handleAddGoal} 
          />
        );
      case 'Dashboard':
      default:
        return (
          <DashboardTab 
            profileData={profileData} 
            addLogEntry={addLogEntry}
            simulatedLocation={simulatedLocation}
            triggerLocationSim={triggerLocationSim}
          />
        );
    }
  };

  // Force intro slideshow first
  if (showIntro) {
    return <OnboardingIntroScreen onFinish={handleFinishIntro} />;
  }

  // Force onboarding modal wrapper if profile is not completed
  if (showProfileSetup) {
    return <ProfileSetupScreen onSave={handleSaveProfile} />;
  }

  // Force report OCR review flow if triggered
  if (showOCRVerification) {
    return (
      <OCRVerificationScreen 
        onConfirm={handleConfirmOCR} 
        onCancel={() => { triggerHaptic(); setShowOCRVerification(false); }} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* TopAppBar header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => { triggerHaptic(); setShowProfileSetup(true); }}>
          <Feather name="user" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VitalPath</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => { triggerHaptic(Haptics.ImpactFeedbackStyle.Medium); setToken(null); }}>
          <Text style={styles.settingsEmoji}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Tab View content */}
      <View style={styles.content}>
        {renderActiveView()}
      </View>

      {/* Tactile Bottom Tab bar */}
      <View style={styles.navBar}>
        {/* Dashboard Tab */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Dashboard' && styles.navItemActive]}
          onPress={() => handleTabChange('Dashboard')}
        >
          <Feather 
            name="grid" 
            size={22} 
            color={activeTab === 'Dashboard' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.navText, activeTab === 'Dashboard' && styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>

        {/* Timeline Tab */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Timeline' && styles.navItemActive]}
          onPress={() => handleTabChange('Timeline')}
        >
          <Feather 
            name="activity" 
            size={22} 
            color={activeTab === 'Timeline' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.navText, activeTab === 'Timeline' && styles.navTextActive]}>Timeline</Text>
        </TouchableOpacity>

        {/* Journal Tab */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Journal' && styles.navItemActive]}
          onPress={() => handleTabChange('Journal')}
        >
          <Feather 
            name="mic" 
            size={22} 
            color={activeTab === 'Journal' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.navText, activeTab === 'Journal' && styles.navTextActive]}>Journal</Text>
        </TouchableOpacity>

        {/* Goals Tab */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'Goals' && styles.navItemActive]}
          onPress={() => handleTabChange('Goals')}
        >
          <Feather 
            name="award" 
            size={22} 
            color={activeTab === 'Goals' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.navText, activeTab === 'Goals' && styles.navTextActive]}>Goals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3f2',
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  settingsBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsEmoji: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.red,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  navBar: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 56,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  navText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: '900',
  },
});
