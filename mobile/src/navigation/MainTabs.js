import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import BooksScreen from '../screens/books/BooksScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import PdfReaderScreen from '../screens/books/PdfReaderScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Books Stack ─────────────────────────────────────────────────────────────
function BooksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e1e3a', borderBottomWidth: 0, elevation: 0 },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: { fontWeight: '800', fontSize: 17 },
      }}
    >
      <Stack.Screen name="BooksList" component={BooksScreen} options={{ title: '📚 Books' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="PdfReader" component={PdfReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ── Home Stack (allows navigating to BookDetail from Home) ──────────────────
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1e1e3a', elevation: 0 },
          headerTintColor: '#f1f5f9',
          headerTitle: 'Book Details',
          headerTitleStyle: { fontWeight: '800' },
        }}
      />
      <Stack.Screen name="PdfReader" component={PdfReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ── Profile Stack (includes Subscription screen) ────────────────────────────
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e1e3a', borderBottomWidth: 0, elevation: 0 },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: { fontWeight: '800', fontSize: 17 },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: '👤 Profile' }} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: '👑 Membership' }} />
    </Stack.Navigator>
  );
}

// ── Bottom Tabs ──────────────────────────────────────────────────────────────
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Books: focused ? 'book' : 'book-outline',
            Categories: focused ? 'grid' : 'grid-outline',
            History: focused ? 'time' : 'time-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#475569',
        tabBarStyle: {
          backgroundColor: '#1e1e3a',
          borderTopColor: '#2d2d50',
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
          elevation: 20,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Books" component={BooksStack} />
      <Tab.Screen name="Categories" component={CategoriesScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1e1e3a', elevation: 0 },
          headerTintColor: '#f1f5f9',
          headerTitle: '📂 Categories',
          headerTitleStyle: { fontWeight: '800' },
        }}
      />
      <Tab.Screen name="History" component={HistoryScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1e1e3a', elevation: 0 },
          headerTintColor: '#f1f5f9',
          headerTitle: '🕐 History',
          headerTitleStyle: { fontWeight: '800' },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
