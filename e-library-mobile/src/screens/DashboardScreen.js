import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { getBooks, saveReadingHistory } from '../services/api';
import { BACKEND_UPLOADS_URL } from '../config';

export default function DashboardScreen({ user }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBook = async (book) => {
    try {
      await saveReadingHistory({
        book_id: book.id,
        last_page: 1,
      });
      Alert.alert(
        book.title,
        `Author: ${book.author}\nCategory: ${book.category_name}\nLevel: ${book.membership_level.toUpperCase()}`
      );
    } catch (err) {
      console.log('History error:', err);
    }
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderBookCard = ({ item }) => (
    <View style={styles.card}>
      {/* 3.5x Wider & 3x Shorter Balanced Rectangular Cover (height 200) */}
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
        <View
          style={[
            styles.badge,
            item.membership_level === 'premium'
              ? styles.badgePremium
              : styles.badgeFree,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.membership_level === 'premium' ? 'PREMIUM' : 'FREE BASIC'}
          </Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor}>
          Author: <Text style={styles.whiteText}>{item.author}</Text>
        </Text>
        <Text style={styles.bookCategory}>
          Category: <Text style={styles.indigoText}>{item.category_name}</Text>
        </Text>

        <TouchableOpacity
          style={[
            styles.readButton,
            item.membership_level === 'premium' && user?.membership_type !== 'premium'
              ? styles.previewButton
              : styles.fullReadButton,
          ]}
          onPress={() => handleOpenBook(item)}
        >
          <Text style={styles.readButtonText}>
            {item.membership_level === 'premium' && user?.membership_type !== 'premium'
              ? 'Preview Sample'
              : 'Read Book'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'Member'} 👋</Text>
        <Text style={styles.subtext}>Explore thousands of digital books</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search books by title..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading library catalog...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderColor: '#334155',
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  coverContainer: {
    height: 200,
    backgroundColor: '#020617',
    position: 'relative',
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
    fontSize: 40,
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePremium: {
    backgroundColor: '#e11d48',
  },
  badgeFree: {
    backgroundColor: '#059669',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  cardDetails: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  bookCategory: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  whiteText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  indigoText: {
    color: '#a5b4fc',
    fontWeight: '600',
  },
  readButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  fullReadButton: {
    backgroundColor: '#059669',
  },
  previewButton: {
    backgroundColor: '#4f46e5',
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 12,
  },
});
