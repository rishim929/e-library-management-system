import React from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const { user } = useAuth();

  const isPremium = book.membership_level === 'premium';
  const userCanRead =
    !isPremium || user?.membership_type === 'premium';

  const coverUri = book.cover_image
    ? `${API_BASE_URL}/uploads/${book.cover_image}`
    : null;

  const handleRead = () => {
    if (!userCanRead) {
      navigation.navigate('Profile', { showSubscription: true });
      return;
    }
    const pdfUrl = `${API_BASE_URL}/uploads/${book.pdf_file}`;
    navigation.navigate('PdfReader', { book, pdfUrl });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverWrap}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={{ fontSize: 80 }}>📚</Text>
            </View>
          )}
          {/* Membership badge overlay */}
          <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeFree]}>
            <Text style={styles.badgeText}>{isPremium ? '👑 Premium' : '✓ Free'}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>

          {book.category_name ? (
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>📂 {book.category_name}</Text>
            </View>
          ) : null}

          {book.description ? (
            <>
              <Text style={styles.descLabel}>About this book</Text>
              <Text style={styles.description}>{book.description}</Text>
            </>
          ) : null}

          {/* Access info */}
          {isPremium && user?.membership_type !== 'premium' && (
            <View style={styles.lockCard}>
              <Text style={styles.lockEmoji}>🔒</Text>
              <View style={styles.lockTextWrap}>
                <Text style={styles.lockTitle}>Premium Book</Text>
                <Text style={styles.lockSub}>Upgrade to Premium to read this book.</Text>
              </View>
            </View>
          )}

          {/* Read Button */}
          <TouchableOpacity
            style={[styles.readBtn, !userCanRead && styles.readBtnLocked]}
            onPress={handleRead}
            activeOpacity={0.85}
          >
            <Text style={styles.readBtnText}>
              {userCanRead ? '📖 Read Now' : '👑 Upgrade to Read'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  scroll: { paddingBottom: 40 },
  coverWrap: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#1e1e3a',
  },
  cover: { width: '100%', height: '100%' },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
  },
  badge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgePremium: { backgroundColor: '#f59e0b' },
  badgeFree: { backgroundColor: '#10b981' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  infoCard: {
    backgroundColor: '#1e1e3a',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  title: { color: '#f1f5f9', fontSize: 22, fontWeight: '800', marginBottom: 6, lineHeight: 30 },
  author: { color: '#94a3b8', fontSize: 15, marginBottom: 12 },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C63FF22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6C63FF44',
  },
  catBadgeText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  descLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  description: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  lockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1a0a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b44',
  },
  lockEmoji: { fontSize: 28, marginRight: 12 },
  lockTextWrap: { flex: 1 },
  lockTitle: { color: '#f59e0b', fontSize: 15, fontWeight: '700' },
  lockSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  readBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
  },
  readBtnLocked: { backgroundColor: '#f59e0b' },
  readBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
