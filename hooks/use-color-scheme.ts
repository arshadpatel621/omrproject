import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  // Call the underlying RN hook to preserve Hook order during Fast Refresh
  const _scheme = useRNColorScheme();
  // Default to dark mode for futuristic look, but respect system preference
  return _scheme ?? 'dark';
}
