import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, RefreshControl, TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [booksRes, catsRes] = await Promise.all([
        bookService.getAll(),
        categoryService.getAll(),
      ]);
      setBooks(booksRes.data);
      setCategories(catsRes.data);
    } catch (e) {
      console.log('Home fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const featuredBooks = books.slice(0, 6);
  const filteredBooks = searchQuery.trim()
    ? books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.category_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Reader'} 👋</Text>
            <Text style={styles.subGreeting}>What will you read today?</Text>
          </View>
          <View style={[styles.memberBadge, user?.membership_type === 'premium' ? styles.badgePremium : styles.badgeFree]}>
            <Text style={styles.memberBadgeText}>
              {user?.membership_type === 'premium' ? '👑 Premium' : '✓ Basic'}
            </Text>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors…"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search Results ── */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results ({filteredBooks.length})</Text>
            {filteredBooks.length === 0 ? (
              <Text style={styles.noResults}>No books found for "{searchQuery}"</Text>
            ) : (
              <View style={styles.booksGrid}>
                {filteredBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onPress={() => navigation.navigate('BookDetail', { book })}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {!searchQuery.trim() && (
          <>
            {/* ── Categories Row ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                  <Text style={styles.seeAll}>See all →</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catChip}
                    onPress={() => navigation.navigate('Books', { categoryFilter: cat.category_name })}
                  >
                    <Text style={styles.catChipText}>{cat.category_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* ── Featured Books ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📚 Featured Books</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Books', {})}>
                  <Text style={styles.seeAll}>See all →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.booksGrid}>
                {featuredBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onPress={() => navigation.navigate('BookDetail', { book })}
                  />
                ))}
              </View>
            </View>

            {/* ── Premium Section ── */}
            {user?.membership_type !== 'premium' && (
              <TouchableOpacity
                style={styles.upgradeCard}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.85}
              >
                <Text style={styles.upgradeEmoji}>👑</Text>
                <View style={styles.upgradeTextContainer}>
                  <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                  <Text style={styles.upgradeSubtitle}>Unlock all books & exclusive content</Text>
                </View>
                <Text style={styles.upgradeArrow}>→</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  greeting: { color: '#f1f5f9', fontSize: 22, fontWeight: '800' },
  subGreeting: { color: '#64748b', fontSize: 13, marginTop: 2 },
  memberBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgePremium: { backgroundColor: '#f59e0b20', borderWidth: 1, borderColor: '#f59e0b' },
  badgeFree: { backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b981' },
  memberBadgeText: { color: '#f1f5f9', fontSize: 12, fontWeight: '700' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#f1f5f9', fontSize: 15, paddingVertical: 13 },
  clearIcon: { color: '#64748b', fontSize: 16, paddingLeft: 8 },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: '800' },
  seeAll: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  catRow: { marginBottom: 4 },
  catChip: {
    backgroundColor: '#1e1e3a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  catChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  booksGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  noResults: { color: '#64748b', fontSize: 14, textAlign: 'center', marginVertical: 24 },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#2a1a5e',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#6C63FF44',
  },
  upgradeEmoji: { fontSize: 28, marginRight: 14 },
  upgradeTextContainer: { flex: 1 },
  upgradeTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: '800' },
  upgradeSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 3 },
  upgradeArrow: { color: '#6C63FF', fontSize: 20, fontWeight: '800' },
  bottomSpace: { height: 20 },
});
