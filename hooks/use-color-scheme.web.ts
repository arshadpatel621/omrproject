import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  // Keep calling the RN hook to preserve Hook order on web, too
  const _scheme = useRNColorScheme();
  return 'light' as const;
}
