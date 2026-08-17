import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyProfile, updateMyProfile } from '../services/api';

export default function ProfileScreen({ user, onLogout }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    membership_type: '',
    preferred_category: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile({
        ...res.data,
        password: '',
      });
    } catch (err) {
      console.log('Profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(profile);
      const updatedUser = {
        ...user,
        name: profile.name,
        preferred_category: profile.preferred_category,
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      Alert.alert('Success', 'Profile updated successfully!');
      loadProfile();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 My Profile</Text>
          <Text style={styles.subtitle}>Manage your account details and membership</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <View style={styles.whiteCard}>
            {/* Crisp Dark Slate Labels (#334155) */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={profile.email}
              editable={false}
            />

            <Text style={styles.label}>Preferred Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Programming, Science"
              placeholderTextColor="#94a3b8"
              value={profile.preferred_category || ''}
              onChangeText={(text) => setProfile({ ...profile, preferred_category: text })}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Leave blank to keep current password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={profile.password}
              onChangeText={(text) => setProfile({ ...profile, password: text })}
            />

            <Text style={styles.label}>Membership Status</Text>
            <TextInput
              style={[styles.input, styles.membershipInput]}
              value={(profile.membership_type || 'basic').toUpperCase()}
              editable={false}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    marginBottom: 20,
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
  /* Crisp White Profile Card Box */
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  /* Explicit Dark Slate Label Color (#334155) */
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    fontWeight: '600',
  },
  readOnlyInput: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  membershipInput: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    fontWeight: '900',
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#e11d48',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
