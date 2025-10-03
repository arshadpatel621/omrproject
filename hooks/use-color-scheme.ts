import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  // Call the underlying RN hook to preserve Hook order during Fast Refresh
  const _scheme = useRNColorScheme();
  // Force light mode regardless of system preference
  return 'light' as const;
}
