import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>📂</Text>
      <Text style={styles.name} numberOfLines={3}>{category.category_name}</Text>
      <Text style={styles.count}>
        {category.book_count != null ? `${category.book_count} Books` : 'Books'}
      </Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>View Books</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d2d50',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  emoji: { fontSize: 32, marginBottom: 8 },
  name: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
    flexShrink: 1,
    width: '100%',
  },
  count: {
    color: '#6C63FF',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
