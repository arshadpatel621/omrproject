import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Direct redirect to home dashboard without authentication
  return <Redirect href="/(tabs)/home" />;
}
