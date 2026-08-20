# E-Library Mobile App (React Native + Expo)

A real native Android & iOS application for the E-Library Management System.

## 📁 Architecture

```
library_management_system/
├── e-library-backend/     ← Existing Node.js/Express backend (unchanged)
├── e-library/             ← Existing React web frontend (unchanged)
└── mobile/                ← NEW: React Native app (this folder)
    ├── src/
    │   ├── config/api.js          ← Axios client + API_BASE_URL
    │   ├── context/AuthContext.js ← JWT + SecureStore auth state
    │   ├── navigation/            ← React Navigation (Stack + Bottom Tabs)
    │   ├── screens/               ← All native screens
    │   ├── services/              ← API service modules
    │   └── components/            ← Shared native components
    ├── App.js
    ├── app.json                   ← Expo config (bundle ID, icons)
    ├── eas.json                   ← EAS Build profiles
    └── .env.example               ← Environment variable template
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (for testing)

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Set API URL
```bash
cp .env.example .env
```
Edit `.env` and set your backend URL:
- **Local dev (physical phone):** `EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_IP:5000`
  - Find your PC's IP: `ipconfig` (Windows) → IPv4 Address
- **Production:** `EXPO_PUBLIC_API_BASE_URL=https://your-backend.onrender.com`

### 3. Start the Mobile App
```bash
cd mobile
npx expo start
```
Scan the QR code with **Expo Go** on your Android/iOS phone.

### 4. Start on Android Emulator
```bash
npx expo start --android
```

### 5. Start on iOS Simulator (macOS only)
```bash
npx expo start --ios
```

---

## 📱 Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | AuthStack | JWT login with email/password |
| Register | AuthStack | New account registration |
| Forgot Password | AuthStack | OTP-based password reset (3 steps) |
| Home | Tab: Home | Featured books, categories, search, upgrade card |
| Books | Tab: Books | Full book list with search + filter chips |
| Book Detail | Books Stack | Cover, info, membership check, Read/Upgrade btn |
| PDF Reader | Books Stack | In-app PDF via Google Docs viewer + history save |
| Categories | Tab: Categories | 2-column category cards with book counts |
| History | Tab: History | Reading history from real DB, Continue Reading |
| Profile | Tab: Profile | Edit name/category/password, membership badge, logout |
| Subscription | Profile Stack | Khalti payment WebView + plan comparison |

---

## 🏗️ Build for Android

### APK (for direct install/testing)
```bash
# Install EAS CLI first (one time)
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
npx eas build -p android --profile preview
```

### AAB (for Google Play Store)
```bash
npx eas build -p android --profile production
```

---

## 🍎 Build for iOS

> **Note:** iOS builds require an Apple Developer account ($99/year). The build runs on Expo's cloud servers so you do NOT need macOS.

```bash
npx eas build -p ios --profile production
```

---

## 🔌 Backend APIs Used

All from the **existing** `e-library-backend/`:

| Endpoint | Method | Usage |
|----------|--------|-------|
| `/api/auth/login` | POST | Login |
| `/api/auth/register` | POST | Register |
| `/api/auth/forgot-password` | POST | Request OTP |
| `/api/auth/verify-otp` | POST | Verify OTP |
| `/api/auth/reset-password` | POST | Reset password |
| `/api/books` | GET | All books |
| `/api/categories` | GET | All categories |
| `/api/users/me` | GET | My profile |
| `/api/users/me` | PUT | Update profile |
| `/api/reading-history` | GET | My reading history |
| `/api/reading-history` | POST | Save reading progress |
| `/api/payments/initiate` | POST | Start Khalti payment |
| `/api/payments/verify` | POST | Verify Khalti payment |
| `/api/subscriptions/upgrade` | POST | Upgrade membership |

---

## 🔒 Security

- JWT stored in **Expo SecureStore** (native encrypted storage — NOT localStorage)
- API secret keys stay on the backend only
- Mobile app never connects directly to MySQL

## 🔧 Backend Change Made

**`e-library-backend/controllers/paymentController.js`** — `return_url` now reads from `process.env.KHALTI_RETURN_URL` (falls back to original value). Web app continues working unchanged.

## 📦 Installed Packages

```
@react-navigation/native       — Navigation container
@react-navigation/bottom-tabs  — Bottom tab navigator
@react-navigation/stack        — Stack navigator
react-native-screens           — Native screen optimization
react-native-safe-area-context — Safe area handling (notches)
react-native-gesture-handler   — Gesture support
react-native-reanimated        — Animations
expo-secure-store              — Secure JWT storage
axios                          — HTTP client
react-native-webview           — In-app PDF viewer + Khalti payment
@expo/vector-icons             — Ionicons icon set
```
