import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { authService } from '../../services/authService';

const STEP = { EMAIL: 'email', OTP: 'otp', RESET: 'reset' };

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) { Alert.alert('Required', 'Enter your email.'); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      Alert.alert('OTP Sent', 'Check your email for the 6-digit OTP.');
      setStep(STEP.OTP);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) { Alert.alert('Required', 'Enter the OTP.'); return; }
    setLoading(true);
    try {
      await authService.verifyOTP(email.trim(), otp.trim());
      setStep(STEP.RESET);
    } catch (err) {
      Alert.alert('Invalid OTP', err.message);
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      Alert.alert('Weak Password', 'Min 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email.trim(), otp.trim(), newPassword);
      Alert.alert('Success!', 'Password reset. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>🔐</Text>
            <Text style={styles.title}>
              {step === STEP.EMAIL && 'Forgot Password'}
              {step === STEP.OTP && 'Verify OTP'}
              {step === STEP.RESET && 'New Password'}
            </Text>
            <Text style={styles.subtitle}>
              {step === STEP.EMAIL && 'Enter your email to receive an OTP'}
              {step === STEP.OTP && `OTP sent to ${email}`}
              {step === STEP.RESET && 'Create your new password'}
            </Text>
          </View>

          <View style={styles.form}>
            {step === STEP.EMAIL && (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSendOTP} disabled={loading}>
                  <Text style={styles.btnText}>{loading ? 'Sending…' : 'Send OTP'}</Text>
                </TouchableOpacity>
              </>
            )}

            {step === STEP.OTP && (
              <>
                <Text style={styles.label}>6-Digit OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  placeholderTextColor="#64748b"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleVerifyOTP} disabled={loading}>
                  <Text style={styles.btnText}>{loading ? 'Verifying…' : 'Verify OTP'}</Text>
                </TouchableOpacity>
              </>
            )}

            {step === STEP.RESET && (
              <>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Min 6 characters"
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleResetPassword} disabled={loading}>
                  <Text style={styles.btnText}>{loading ? 'Resetting…' : 'Reset Password'}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8, textAlign: 'center' },
  form: { backgroundColor: '#1e1e3a', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#2d2d50' },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
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
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
});
