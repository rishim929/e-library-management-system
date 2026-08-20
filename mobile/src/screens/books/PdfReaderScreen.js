import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { historyService } from '../../services/historyService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PdfReaderScreen({ route, navigation }) {
  const { book, pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const historySaved = useRef(false);

  const saveHistory = useCallback(async () => {
    if (historySaved.current) return;
    historySaved.current = true;
    try {
      await historyService.saveHistory(book.id, 1);
    } catch (e) {
      console.log('Save history error:', e.message);
    }
  }, [book.id]);

  const handleLoad = () => {
    setLoading(false);
    saveHistory();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Google Docs viewer — renders PDF inline inside WebView without opening a browser
  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{book.title}</Text>
        <View style={styles.spacer} />
      </View>

      {/* PDF WebView */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📄</Text>
          <Text style={styles.errorTitle}>Could not load PDF</Text>
          <Text style={styles.errorSub}>The file may be unavailable or requires authentication.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setError(false); setLoading(true); }}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webviewContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <LoadingSpinner />
              <Text style={styles.loadingText}>Loading PDF…</Text>
            </View>
          )}
          <WebView
            source={{ uri: googleViewerUrl }}
            style={styles.webview}
            onLoad={handleLoad}
            onError={handleError}
            startInLoadingState={false}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            scalesPageToFit
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f23' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d50',
  },
  backBtn: { paddingRight: 12 },
  backText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
  headerTitle: { flex: 1, color: '#f1f5f9', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  spacer: { width: 60 },
  webviewContainer: { flex: 1, position: 'relative' },
  webview: { flex: 1, backgroundColor: '#0f0f23' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorEmoji: { fontSize: 60, marginBottom: 16 },
  errorTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  errorSub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  retryBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
