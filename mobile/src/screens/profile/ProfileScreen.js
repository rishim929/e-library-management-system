import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [preferredCategory, setPreferredCategory] = useState(user?.preferred_category || '');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Required', 'Name cannot be empty.'); return; }
    setSaving(true);
    try {
      const payload = { name: name.trim(), preferred_category: preferredCategory.trim() };
      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          Alert.alert('Weak Password', 'Password must be at least 6 characters.');
          setSaving(false);
          return;
        }
        payload.password = newPassword;
      }
      await profileService.updateMe(payload);
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully.');
      setNewPassword('');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar / Header */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {/* Membership badge */}
            <View style={[styles.memBadge, user?.membership_type === 'premium' ? styles.memPremium : styles.memFree]}>
              <Text style={styles.memBadgeText}>
                {user?.membership_type === 'premium' ? '👑 Premium Member' : '✓ Basic Member'}
              </Text>
            </View>
          </View>

          {/* Edit Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#64748b"
            />

            <Text style={styles.label}>Email</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>{user?.email}</Text>
            </View>

            <Text style={styles.label}>Preferred Category</Text>
            <TextInput
              style={styles.input}
              value={preferredCategory}
              onChangeText={setPreferredCategory}
              placeholder="e.g. Science, Technology"
              placeholderTextColor="#64748b"
            />

            <Text style={styles.label}>New Password (leave blank to keep current)</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Min 6 characters"
              placeholderTextColor="#64748b"
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>

          {/* Membership Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Membership</Text>
            <View style={styles.memberCard}>
              <View style={styles.memberRow}>
                <Text style={styles.memberLabel}>Plan</Text>
                <Text style={styles.memberValue}>
                  {user?.membership_type === 'premium' ? 'Premium' : 'Basic (Free)'}
                </Text>
              </View>
              <View style={styles.memberRow}>
                <Text style={styles.memberLabel}>Role</Text>
                <Text style={styles.memberValue}>{user?.role}</Text>
              </View>

              {user?.membership_type !== 'premium' && (
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => navigation.navigate('Subscription')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.upgradeBtnText}>👑 Upgrade to Premium</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  flex: { flex: 1 },
  scroll: { paddingBottom: 20 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  userName: { color: '#f1f5f9', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  userEmail: { color: '#94a3b8', fontSize: 14, marginBottom: 12 },
  memBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  memPremium: { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' },
  memFree: { backgroundColor: '#10b98120', borderColor: '#10b981' },
  memBadgeText: { color: '#f1f5f9', fontSize: 13, fontWeight: '700' },
  section: {
    backgroundColor: '#1e1e3a',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  sectionTitle: { color: '#f1f5f9', fontSize: 16, fontWeight: '800', marginBottom: 16 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#0f0f23',
    color: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: '#0f0f2380',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  disabledText: { color: '#475569', fontSize: 15 },
  saveBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  memberCard: {},
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d50',
  },
  memberLabel: { color: '#94a3b8', fontSize: 14 },
  memberValue: { color: '#f1f5f9', fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  upgradeBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  logoutBtn: {
    marginHorizontal: 16,
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef444433',
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
