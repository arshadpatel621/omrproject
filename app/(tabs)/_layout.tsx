import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const theme = Colors[colorScheme ?? 'dark'];
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  
  const initialRouteName = user?.role === 'ADMIN' ? 'admin' : user?.role === 'TEACHER' ? 'teacher' : 'home';

  return (
    <Tabs
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        header: ({ route, options }) => (
          <Animated.View 
            entering={FadeInDown.duration(300)}
            style={[
              styles.header,
              {
                backgroundColor: surfaceColor,
                borderBottomColor: borderColor,
              }
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <IconSymbol name="doc.text.fill" size={24} color={primaryColor} />
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Smart OMR
                </Text>
              </View>
              <ThemeToggle />
            </View>
          </Animated.View>
        ),
        tabBarButton: HapticTab,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: theme.icon,
        tabBarStyle: {
          backgroundColor: surfaceColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          ...Shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Inter',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "house.fill" : "house"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exam-details"
        options={{
          title: 'Exam Details',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "doc.text.fill" : "doc.text"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload Sheets',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "square.and.arrow.up.fill" : "square.and.arrow.up"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "chart.bar.fill" : "chart.bar"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="teacher" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: Spacing.sm,
    fontFamily: 'Inter',
  },
});
