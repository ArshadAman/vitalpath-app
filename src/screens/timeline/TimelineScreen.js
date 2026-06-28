import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

export default function TimelineScreen({ timelineEntries, onUploadPress }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'vitals', 'reports', 'voice', 'goals'

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const categories = [
    { id: 'all', label: 'All Logs' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'reports', label: 'Reports' },
    { id: 'voice', label: 'Voice' },
    { id: 'goals', label: 'Goals' }
  ];

  // Filtering logic
  const filteredEntries = timelineEntries.filter(entry => {
    const matchesFilter = activeFilter === 'all' || entry.category === activeFilter;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'vitals': 
        return <Feather name="heart" size={16} color={COLORS.red} />;
      case 'reports': 
        return <Feather name="file-text" size={16} color={COLORS.secondary} />;
      case 'voice': 
        return <Feather name="mic" size={16} color={COLORS.primary} />;
      case 'goals': 
        return <Feather name="award" size={16} color={COLORS.orange} />;
      default: 
        return <Feather name="edit-3" size={16} color={COLORS.textMuted} />;
    }
  };

  const handleFilterPress = (catId) => {
    triggerHaptic();
    setActiveFilter(catId);
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search health events..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.uploadBtn} onPress={onUploadPress}>
          <Feather name="plus-circle" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={styles.pillsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, activeFilter === cat.id && styles.pillActive]}
              onPress={() => handleFilterPress(cat.id)}
            >
              <Text style={[styles.pillText, activeFilter === cat.id && styles.pillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Timeline Scroll List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="search" size={48} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No matching logs found</Text>
            <Text style={styles.emptySub}>Try adjusting your search query or filters.</Text>
          </View>
        ) : (
          <View style={styles.timelineList}>
            {/* Continuous Vertical line track */}
            <View style={styles.timelineTrack} />

            {filteredEntries.map((entry, index) => (
              <View key={entry.id || index} style={styles.timelineItem}>
                {/* Active category Node */}
                <View style={styles.nodeWrapper}>
                  <View style={styles.nodeCircle}>
                    {renderCategoryIcon(entry.category)}
                  </View>
                </View>

                {/* Event Details Card */}
                <View style={styles.eventCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTime}>{entry.timestamp || 'Today'}</Text>
                    
                    {entry.scoreChange !== undefined && (
                      <View style={[
                        styles.impactBadge,
                        { backgroundColor: entry.scoreChange >= 0 ? COLORS.primaryContainer : '#fef2f2' }
                      ]}>
                        <Text style={[
                          styles.impactText,
                          { color: entry.scoreChange >= 0 ? COLORS.primary : COLORS.red }
                        ]}>
                          {entry.scoreChange >= 0 ? `+${entry.scoreChange}` : entry.scoreChange}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cardTitle}>{entry.title}</Text>
                  <Text style={styles.cardDesc}>{entry.description}</Text>

                  {entry.value && (
                    <View style={styles.valueRow}>
                      <Text style={styles.valueLabel}>Measured Value:</Text>
                      <Text style={styles.valueText}>{entry.value}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f3f2',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  uploadBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.secondaryShadow,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.secondaryShadow,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillsWrapper: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  pill: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    borderColor: COLORS.primary,
    borderBottomColor: COLORS.primaryShadow,
    backgroundColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  pillTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  timelineList: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineTrack: {
    position: 'absolute',
    left: 21,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: COLORS.border,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  nodeWrapper: {
    position: 'absolute',
    left: -20,
    top: 4,
    zIndex: 10,
  },
  nodeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  eventCard: {
    flex: 1,
    marginLeft: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.border,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  impactBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '900',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  valueRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#f5f3f2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.secondary,
  },
});
