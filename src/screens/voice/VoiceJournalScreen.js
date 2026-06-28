import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

export default function VoiceJournalScreen({ addLogEntry }) {
  const [recording, setRecording] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState(null);
  
  const [btnPressed, setBtnPressed] = useState(false);

  const voicePresets = [
    {
      id: 1,
      speech: "I smoked two cigarettes after lunch.",
      transcription: "I smoked two cigarettes after lunch.",
      parsed: { event: "Smoking Event", value: "2 counts", category: "logs", scoreChange: -6 }
    },
    {
      id: 2,
      speech: "Completed a five kilometer run this morning and felt great.",
      transcription: "Completed a 5 km run this morning and felt great.",
      parsed: { event: "Cardio Workout", value: "5 km", category: "vitals", scoreChange: 3 }
    },
    {
      id: 3,
      speech: "I drank three glasses of wine at dinner.",
      transcription: "I drank three glasses of wine at dinner.",
      parsed: { event: "Alcohol Intake", value: "3 glasses", category: "logs", scoreChange: -4 }
    }
  ];

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const startMockRecording = (preset) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setRecording(true);
    setSelectedPreset(preset);
    setTranscript('Listening...');
    setParsedData(null);

    // Simulate soundwave processing and typing
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTranscript(`"${preset.transcription}"`);
      setParsedData(preset.parsed);
      setRecording(false);
    }, 2000);
  };

  const handleSaveNote = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (!parsedData) return;

    addLogEntry({
      title: `${parsedData.event} (Voice Log)`,
      category: parsedData.category,
      description: `Voice transcript: ${transcript}`,
      value: parsedData.value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scoreChange: parsedData.scoreChange
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Voice Note Saved', 'Timeline updated with extracted contextual habits.');
    setSelectedPreset(null);
    setTranscript('');
    setParsedData(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Journal</Text>
        <Text style={styles.subtitle}>Dictate logs naturally. The AI parses health activities automatically.</Text>
      </View>

      {/* Recording Ring Area */}
      <View style={styles.recorderCard}>
        <View style={styles.micOuterRing}>
          <TouchableOpacity 
            style={[styles.micBtn, recording && styles.micBtnActive]}
            disabled={recording}
            onPress={() => triggerHaptic(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Feather name={recording ? "stop-circle" : "mic"} size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {recording ? (
          <View style={styles.soundwaveContainer}>
            <View style={[styles.soundwaveBar, { height: 16 }]} />
            <View style={[styles.soundwaveBar, { height: 32 }]} />
            <View style={[styles.soundwaveBar, { height: 48 }]} />
            <View style={[styles.soundwaveBar, { height: 28 }]} />
            <View style={[styles.soundwaveBar, { height: 16 }]} />
          </View>
        ) : (
          <Text style={styles.instructionText}>Select a preset bubble below to simulate speech</Text>
        )}
      </View>

      {/* Preset Speech Bubbles */}
      <Text style={styles.sectionTitle}>Simulate Speech Inputs</Text>
      <View style={styles.presetContainer}>
        {voicePresets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={[
              styles.presetBubble,
              selectedPreset?.id === preset.id && styles.presetBubbleActive
            ]}
            onPress={() => startMockRecording(preset)}
            disabled={recording}
          >
            <View style={styles.presetContent}>
              <Feather 
                name="message-square" 
                size={14} 
                color={selectedPreset?.id === preset.id ? COLORS.primary : COLORS.textMuted} 
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text style={[
                styles.presetText,
                selectedPreset?.id === preset.id && styles.presetTextActive
              ]}>
                "{preset.speech}"
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transcript & Parse Card */}
      {transcript ? (
        <View style={styles.transcriptCard}>
          <Text style={styles.cardHeader}>AI Transcription</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>

          {parsedData && (
            <View style={styles.parsedContainer}>
              <Text style={styles.cardHeader}>Structured Health Event</Text>
              
              <View style={styles.parsedContent}>
                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Extracted Event:</Text>
                  <Text style={styles.parsedVal}>{parsedData.event}</Text>
                </View>
                
                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Quantity / Value:</Text>
                  <Text style={styles.parsedVal}>{parsedData.value}</Text>
                </View>

                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Estimated Score Delta:</Text>
                  <Text style={[
                    styles.scoreDeltaText,
                    { color: parsedData.scoreChange >= 0 ? COLORS.primary : COLORS.red }
                  ]}>
                    {parsedData.scoreChange >= 0 ? `+${parsedData.scoreChange}` : parsedData.scoreChange} points
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPressIn={() => setBtnPressed(true)}
                onPressOut={() => setBtnPressed(false)}
                onPress={handleSaveNote}
                style={[
                  styles.saveBtn,
                  btnPressed ? styles.saveBtnActive : styles.saveBtnNormal
                ]}
              >
                <Text style={styles.saveBtnText}>ADD NOTE TO TIMELINE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    marginVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
    lineHeight: 20,
  },
  recorderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 5,
    borderBottomColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  micOuterRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  micBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryShadow,
    borderBottomWidth: 5,
    borderBottomColor: COLORS.primaryShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondaryShadow,
    borderBottomWidth: 1,
    transform: [{ translateY: 4 }],
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  soundwaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
  },
  soundwaveBar: {
    width: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  presetContainer: {
    gap: 10,
    marginBottom: 20,
  },
  presetBubble: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  presetBubbleActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primaryContainer,
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  presetText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  presetTextActive: {
    color: COLORS.primary,
  },
  transcriptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 6,
    borderBottomColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  parsedContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  parsedContent: {
    backgroundColor: '#f5f3f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    gap: 6,
  },
  parsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  parsedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  parsedVal: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.text,
  },
  scoreDeltaText: {
    fontSize: 12,
    fontWeight: '900',
  },
  saveBtn: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnNormal: {
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primaryShadow,
    transform: [{ translateY: 0 }],
  },
  saveBtnActive: {
    borderBottomWidth: 0,
    transform: [{ translateY: 4 }],
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
