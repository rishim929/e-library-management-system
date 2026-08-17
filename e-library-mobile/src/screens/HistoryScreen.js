import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { getReadingHistory } from '../services/api';
import { BACKEND_UPLOADS_URL } from '../config';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getReadingHistory();
      setHistory(res.data);
    } catch (err) {
      console.log('History error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryCard = ({ item }) => (
    <View style={styles.card}>
      {/* 3.5x Wider & 3x Shorter Cover Container (height 190) */}
      <View style={styles.coverContainer}>
        {item.cover_image ? (
          <Image
            source={{ uri: `${BACKEND_UPLOADS_URL}/covers/${item.cover_image}` }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderEmoji}>📖</Text>
            <Text style={styles.placeholderText}>No Cover</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author}>
          Author: <Text style={styles.whiteText}>{item.author}</Text>
        </Text>
        <Text style={styles.lastPage}>
          Last Page Read: <Text style={styles.indigoText}>Page {item.last_page}</Text>
        </Text>
        <Text style={styles.timestamp}>
          🕒 {new Date(item.last_opened).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📖 Reading History</Text>
        <Text style={styles.subtitle}>Track your recent reading progress</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>No books read yet</Text>
          <Text style={styles.emptySubtitle}>
            Books you read will automatically appear here with page tracking.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHistoryCard}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  coverContainer: {
    height: 190,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 20,
  },
  author: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  lastPage: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  whiteText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  indigoText: {
    color: '#818cf8',
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
