import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Redirect href="/auth/login" />;
  return <Redirect href="/post-login" />;
}