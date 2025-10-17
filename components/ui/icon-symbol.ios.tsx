import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// Map custom names to valid SF Symbol names
const SF_SYMBOL_MAPPING: Record<string, string> = {
  // Chart and analytics
  'chart.line.uptrend.xyaxis': 'chart.xyaxis.line',
  'trophy.fill': 'trophy.fill',
  'person.3.fill': 'person.3.fill',
  
  // UI elements
  'info.circle.fill': 'info.circle.fill',
  'number.circle.fill': 'number.circle.fill',
  'checkmark.circle.fill': 'checkmark.circle.fill',
  'checkmark.circle': 'checkmark.circle',
  'person.circle.fill': 'person.circle.fill',
  'gearshape.fill': 'gearshape.fill',
  'clock.fill': 'clock.fill',
  'clock': 'clock',
  
  // Documents
  'doc.text.fill': 'doc.text.fill',
  'doc.text': 'doc.text',
  'text.alignleft': 'text.alignleft',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'] | string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Use mapped symbol name if available, otherwise use the original name
  const symbolName = SF_SYMBOL_MAPPING[name as string] || name;
  
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={symbolName as SymbolViewProps['name']}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
