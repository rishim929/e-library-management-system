import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity,
} from 'react-native';
import { categoryService } from '../../services/categoryService';
import CategoryCard from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (e) {
      console.log('Categories error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const onRefresh = () => { setRefreshing(true); fetchCategories(); };

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={categories}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => navigation.navigate('Books', { categoryFilter: item.category_name })}
          />
        )}
        ListHeaderComponent={
          <Text style={styles.header}>Browse Categories</Text>
        }
        ListEmptyComponent={<EmptyState icon="grid-outline" message="No categories found." />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  header: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: '800',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
});
