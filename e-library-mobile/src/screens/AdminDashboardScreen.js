import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { getDashboardStats, getNotifications, markAllNotificationsRead } from '../services/api';

export default function AdminDashboardScreen({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, notifRes] = await Promise.all([
        getDashboardStats(),
        getNotifications(),
      ]);
      setStats(statsRes.data);
      setNotifications(notifRes.data);
      const unread = notifRes.data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const statBoxes = [
    { title: 'Total Books', value: stats?.totalBooks || 0, icon: '📚', color: '#6366f1' },
    { title: 'Categories', value: stats?.totalCategories || 0, icon: '📂', color: '#059669' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#3b82f6' },
    { title: 'Premium Users', value: stats?.premiumUsers || 0, icon: '👑', color: '#e11d48' },
    { title: 'Subscriptions', value: stats?.activeSubscriptions || 0, icon: '💳', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Admin Header with Notification Bell */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Welcome back, {user?.name || 'Admin'}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => setShowNotifications(true)}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          /* 5 Centered Statistic Boxes */
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Overview Statistics</Text>

            <View style={styles.grid}>
              {statBoxes.map((box, index) => (
                <View key={index} style={styles.statCard}>
                  <Text style={styles.statIcon}>{box.icon}</Text>
                  <Text style={styles.statTitle}>{box.title}</Text>
                  <Text style={[styles.statValue, { color: box.color }]}>
                    {box.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Rightward Notification Modal */}
      <Modal
        visible={showNotifications}
        animationType="fade"
        transparent
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <View style={styles.notifDropdown}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              <TouchableOpacity onPress={handleReadAll}>
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
              <Text style={styles.emptyNotif}>No notifications</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(n) => n.id.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.notifItem, item.is_read && styles.readItem]}>
                    <Text style={styles.notifItemTitle}>{item.title}</Text>
                    <Text style={styles.notifItemMsg}>{item.message}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellButton: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e11d48',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  logoutBtn: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 14,
  },
  statsContainer: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  /* Perfectly Centered White Statistic Box (Icon Top, Label Middle, Number Bottom) */
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    minHeight: 125,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  notifDropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    maxHeight: 350,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
  },
  emptyNotif: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#64748b',
    fontSize: 13,
  },
  notifItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  readItem: {
    opacity: 0.6,
  },
  notifItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  notifItemMsg: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
});
