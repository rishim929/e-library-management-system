import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import { bookService } from '../../services/bookService';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function BooksScreen({ navigation, route }) {
  const categoryFilter = route.params?.categoryFilter || null;
  const [allBooks, setAllBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all'); // 'all' | 'free' | 'premium'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await bookService.getAll();
      setAllBooks(res.data);
    } catch (e) {
      console.log('Books fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    let result = allBooks;
    if (categoryFilter) {
      result = result.filter(b => b.category_name === categoryFilter);
    }
    if (memberFilter !== 'all') {
      result = result.filter(b => b.membership_level === memberFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.category_name || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [allBooks, search, memberFilter, categoryFilter]);

  const onRefresh = () => { setRefreshing(true); fetchBooks(); };

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search title, author, category…"
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {['all', 'free', 'premium'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, memberFilter === f && styles.chipActive]}
            onPress={() => setMemberFilter(f)}
          >
            <Text style={[styles.chipText, memberFilter === f && styles.chipTextActive]}>
              {f === 'all' ? 'All' : f === 'free' ? '✓ Free' : '👑 Premium'}
            </Text>
          </TouchableOpacity>
        ))}
        {categoryFilter && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>📂 {categoryFilter}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { book: item })} />
        )}
        ListEmptyComponent={<EmptyState icon="book-outline" message="No books found." />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    margin: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#f1f5f9', fontSize: 15, paddingVertical: 13 },
  clearIcon: { color: '#64748b', fontSize: 16, paddingLeft: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1e1e3a',
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  chipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  chipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
});
