import React from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ViewStyle,
  StyleSheet
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/theme';

export interface ContainerProps {
  children: React.ReactNode;
  safe?: boolean;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  padding?: keyof typeof Spacing;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  testID?: string;
}

export function Container({
  children,
  safe = true,
  scroll = false,
  keyboardAvoiding = false,
  padding = 'lg',
  style,
  contentContainerStyle,
  testID,
}: ContainerProps) {
  const backgroundColor = useThemeColor({}, 'background');

  const containerStyle = [
    styles.base,
    { 
      backgroundColor,
      padding: Spacing[padding],
    },
    style,
  ];

  const content = (
    <View style={containerStyle} testID={testID}>
      {children}
    </View>
  );

  const scrollContent = scroll ? (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[
        { padding: Spacing[padding] },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : content;

  const keyboardAvoidingContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor }}
    >
      {scrollContent}
    </KeyboardAvoidingView>
  ) : scrollContent;

  if (safe) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        {keyboardAvoidingContent}
      </SafeAreaView>
    );
  }

  return keyboardAvoidingContent;
}

export interface PageContainerProps extends ContainerProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function PageContainer({
  header,
  footer,
  children,
  ...containerProps
}: PageContainerProps) {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Container {...containerProps} padding="none">
      {header}
      <Container 
        {...containerProps} 
        safe={false}
        style={[{ flex: 1 }, containerProps.style]}
      >
        {children}
      </Container>
      {footer}
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});