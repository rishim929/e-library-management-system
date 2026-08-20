import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  Image, TouchableOpacity, RefreshControl,
} from 'react-native';
import { historyService } from '../../services/historyService';
import { API_BASE_URL } from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await historyService.getMyHistory();
      setHistory(res.data);
    } catch (e) {
      console.log('History error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  const onRefresh = () => { setRefreshing(true); fetchHistory(); };

  const handleContinue = (item) => {
    const book = {
      id: item.book_id,
      title: item.title,
      author: item.author,
      cover_image: item.cover_image,
      pdf_file: item.pdf_file,
      membership_level: item.membership_level,
    };
    const pdfUrl = `${API_BASE_URL}/uploads/${item.pdf_file}`;
    navigation.navigate('PdfReader', { book, pdfUrl });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <LoadingSpinner />;

  const renderItem = ({ item }) => {
    const coverUri = item.cover_image
      ? `${API_BASE_URL}/uploads/${item.cover_image}`
      : null;

    return (
      <View style={styles.card}>
        {/* Cover */}
        <View style={styles.coverWrap}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={{ fontSize: 28 }}>📚</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
          <Text style={styles.meta}>
            {item.last_page ? `Page ${item.last_page}` : 'Started'}
          </Text>
          <Text style={styles.date}>{formatDate(item.last_opened)}</Text>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => handleContinue(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>▶ Continue Reading</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={history}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.header}>Reading History</Text>}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            message={"No reading history yet.\nStart reading a book to track your progress!"}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  header: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: '800',
    paddingVertical: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d2d50',
    elevation: 3,
  },
  coverWrap: { width: 90, height: 130 },
  cover: { width: '100%', height: '100%' },
  coverPlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: { color: '#f1f5f9', fontSize: 14, fontWeight: '700', lineHeight: 20 },
  author: { color: '#94a3b8', fontSize: 12, marginTop: 3 },
  meta: { color: '#6C63FF', fontSize: 12, fontWeight: '600', marginTop: 4 },
  date: { color: '#475569', fontSize: 11, marginTop: 2 },
  continueBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 8,
  },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
