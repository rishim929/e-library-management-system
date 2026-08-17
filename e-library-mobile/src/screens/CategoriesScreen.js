import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { getCategories, getBooks } from '../services/api';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, bookRes] = await Promise.all([
        getCategories(),
        getBooks(),
      ]);
      setCategories(catRes.data);
      setBooks(bookRes.data);
    } catch (err) {
      console.log('Categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryCard = ({ item }) => {
    const totalBooks = books.filter(
      (b) => b.category_name === item.category_name
    ).length;

    return (
      <View style={styles.card}>
        {/* Centered Category Title - Dark Slate, Line Wrap for long names */}
        <Text style={styles.categoryTitle}>
          {item.category_name}
        </Text>

        <Text style={styles.bookCount}>
          {totalBooks} {totalBooks === 1 ? 'Book' : 'Books'}
        </Text>

        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Books</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📂 Categories</Text>
        <Text style={styles.subtitle}>Explore books organized by genre</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryCard}
          numColumns={2}
          columnWrapperStyle={styles.rowWrapper}
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
  title: {
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
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  /* Centered White Category Card Box */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  bookCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
