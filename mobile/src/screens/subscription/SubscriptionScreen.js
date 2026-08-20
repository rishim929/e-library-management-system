import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../context/AuthContext';
import { subscriptionService } from '../../services/subscriptionService';

// Khalti Premium Plan: NPR 500 (amount in paisa = 50000)
const PREMIUM_AMOUNT_PAISA = 50000;
const PREMIUM_AMOUNT_NPR = 500;

export default function SubscriptionScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const isPremium = user?.membership_type === 'premium';
  const [loading, setLoading] = useState(false);
  const [khaltiUrl, setKhaltiUrl] = useState(null);

  const handleUpgrade = async () => {
    Alert.alert(
      'Upgrade to Premium',
      `You will be charged NPR ${PREMIUM_AMOUNT_NPR} via Khalti to unlock all premium books for 30 days.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed to Pay', onPress: startPayment },
      ]
    );
  };

  const startPayment = async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.initiatePayment(
        PREMIUM_AMOUNT_PAISA,
        `order_${Date.now()}`,
        'E-Library Premium Plan'
      );
      if (res.data?.data?.payment_url) {
        setKhaltiUrl(res.data.data.payment_url);
      } else {
        Alert.alert('Error', 'Could not initiate payment. Try again.');
      }
    } catch (err) {
      Alert.alert('Payment Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Khalti redirect after payment
  const handleNavChange = async (navState) => {
    const url = navState.url || '';
    // Khalti redirects to return_url with ?pidx=... after payment
    if (url.includes('pidx=')) {
      const pidxMatch = url.match(/pidx=([^&]+)/);
      if (pidxMatch) {
        const pidx = pidxMatch[1];
        setKhaltiUrl(null);
        setLoading(true);
        try {
          await subscriptionService.verifyPayment(pidx);
          await refreshUser();
          Alert.alert('🎉 Premium Activated!', 'You now have access to all premium books.');
        } catch (err) {
          Alert.alert('Verification Failed', err.message);
        } finally {
          setLoading(false);
        }
      }
    }
    // User cancelled Khalti
    if (url.includes('cancel') || url.includes('failed')) {
      setKhaltiUrl(null);
      Alert.alert('Payment Cancelled', 'Your payment was not completed.');
    }
  };

  // Show Khalti WebView payment page
  if (khaltiUrl) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.khaltiHeader}>
          <TouchableOpacity onPress={() => setKhaltiUrl(null)} style={styles.backBtn}>
            <Text style={styles.backText}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.khaltiTitle}>Khalti Payment</Text>
          <View style={{ width: 70 }} />
        </View>
        <WebView
          source={{ uri: khaltiUrl }}
          onNavigationStateChange={handleNavChange}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Membership</Text>

        {/* Current Status */}
        <View style={[styles.statusCard, isPremium ? styles.statusPremium : styles.statusFree]}>
          <Text style={styles.statusEmoji}>{isPremium ? '👑' : '✓'}</Text>
          <Text style={styles.statusTitle}>
            {isPremium ? 'Premium Member' : 'Basic Member (Free)'}
          </Text>
          <Text style={styles.statusSub}>
            {isPremium
              ? 'You have full access to all books including premium titles.'
              : 'You can read free books. Upgrade to access premium books.'}
          </Text>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Plans</Text>

        {/* Free Plan */}
        <View style={[styles.planCard, !isPremium && styles.planCardActive]}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Basic</Text>
            <Text style={styles.planPrice}>Free</Text>
          </View>
          <Text style={styles.planFeature}>✓ Access to all free books</Text>
          <Text style={styles.planFeature}>✓ Reading history</Text>
          <Text style={styles.planFeature}>✓ Search & browse</Text>
          <Text style={styles.planFeatureOff}>✗ Premium books locked</Text>
        </View>

        {/* Premium Plan */}
        <View style={[styles.planCard, styles.planCardPremium, isPremium && styles.planCardActive]}>
          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: '#f59e0b' }]}>👑 Premium</Text>
            <Text style={[styles.planPrice, { color: '#f59e0b' }]}>NPR {PREMIUM_AMOUNT_NPR}</Text>
          </View>
          <Text style={styles.planSub}>30-day access via Khalti</Text>
          <Text style={styles.planFeature}>✓ Everything in Basic</Text>
          <Text style={styles.planFeature}>✓ All premium books</Text>
          <Text style={styles.planFeature}>✓ Exclusive content</Text>
          <Text style={styles.planFeature}>✓ Priority support</Text>

          {!isPremium && (
            <TouchableOpacity
              style={[styles.upgradeBtn, loading && styles.btnDisabled]}
              onPress={handleUpgrade}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.upgradeBtnText}>Upgrade with Khalti</Text>
              }
            </TouchableOpacity>
          )}

          {isPremium && (
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>✓ Current Plan</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  scroll: { padding: 16, paddingBottom: 40 },
  pageTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  statusPremium: { backgroundColor: '#1a120050', borderColor: '#f59e0b55' },
  statusFree: { backgroundColor: '#0a1a1050', borderColor: '#10b98155' },
  statusEmoji: { fontSize: 48, marginBottom: 10 },
  statusTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  statusSub: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  planCard: {
    backgroundColor: '#1e1e3a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2d2d50',
  },
  planCardPremium: { borderColor: '#f59e0b44' },
  planCardActive: { borderColor: '#6C63FF', borderWidth: 2 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planName: { color: '#f1f5f9', fontSize: 18, fontWeight: '800' },
  planPrice: { color: '#6C63FF', fontSize: 18, fontWeight: '800' },
  planSub: { color: '#94a3b8', fontSize: 12, marginBottom: 10 },
  planFeature: { color: '#94a3b8', fontSize: 13, paddingVertical: 3 },
  planFeatureOff: { color: '#475569', fontSize: 13, paddingVertical: 3 },
  upgradeBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  upgradeBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  activeTag: {
    backgroundColor: '#10b98120',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  activeTagText: { color: '#10b981', fontWeight: '700', fontSize: 14 },
  khaltiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d50',
  },
  backBtn: { paddingRight: 12 },
  backText: { color: '#ef4444', fontSize: 15, fontWeight: '600' },
  khaltiTitle: { flex: 1, color: '#f1f5f9', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23',
  },
});
