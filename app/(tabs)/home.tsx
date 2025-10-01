import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 12 }}>Smart OMR Evaluator</ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.8, marginBottom: 24 }}>
          Our platform simplifies OMR evaluation, providing accurate and efficient results.
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150)}>
        <Pressable style={styles.navBtn} onPress={() => router.push('/(tabs)/home')}>
          <ThemedText style={styles.navBtnText}>Home</ThemedText>
        </Pressable>
      </Animated.View>

      {user?.role === 'TEACHER' && (
        <Animated.View entering={FadeInDown.delay(250)}>
          <Pressable style={styles.navBtn} onPress={() => router.push('/(tabs)/upload')}>
            <ThemedText style={styles.navBtnText}>Upload OMR</ThemedText>
          </Pressable>
        </Animated.View>
      )}

      {user?.role === 'ADMIN' && (
        <Animated.View entering={FadeInDown.delay(350)}>
          <Pressable style={styles.navBtn} onPress={() => router.push('/(tabs)/admin')}>
            <ThemedText style={styles.navBtnText}>Admin Dashboard</ThemedText>
          </Pressable>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(450)}>
        <Pressable style={[styles.navBtn, styles.primary]} onPress={() => router.push('/(tabs)/results')}>
          <ThemedText style={[styles.navBtnText, { color: '#fff' }]}>Results</ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  navBtn: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#e5f0ff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primary: { backgroundColor: '#0b64e5', borderColor: '#0b64e5' },
  navBtnText: { fontWeight: '700', color: '#0b64e5' },
});