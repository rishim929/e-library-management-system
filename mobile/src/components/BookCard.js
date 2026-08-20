import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2-column grid with padding

export default function BookCard({ book, onPress }) {
  const isPremium = book.membership_level === 'premium';
  const coverUri = book.cover_image
    ? `${API_BASE_URL}/uploads/${book.cover_image}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>📚</Text>
          </View>
        )}
        {/* Membership Badge */}
        <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeFree]}>
          <Text style={styles.badgeText}>{isPremium ? '👑 Premium' : '✓ Free'}</Text>
        </View>
      </View>

      {/* Book Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        {book.category_name ? (
          <Text style={styles.category} numberOfLines={1}>{book.category_name}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d2d50',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: { fontSize: 40 },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgePremium: { backgroundColor: '#f59e0b' },
  badgeFree: { backgroundColor: '#10b981' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: 10 },
  title: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
    lineHeight: 18,
  },
  author: { color: '#94a3b8', fontSize: 11, marginBottom: 2 },
  category: {
    color: '#6C63FF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
