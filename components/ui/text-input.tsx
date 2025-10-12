import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius, Typography } from '@/constants/theme';

export interface UITextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export function UITextInput({
  label,
  error,
  helperText,
  variant = 'outline',
  size = 'md',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}: UITextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const backgroundColor = useThemeColor({}, variant === 'filled' ? 'backgroundMuted' : 'surface');
  const borderColor = useThemeColor({}, error ? 'error' : isFocused ? 'borderFocus' : 'border');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'textMuted');
  const errorColor = useThemeColor({}, 'error');

  const getInputStyles = () => {
    const baseStyle = {
      ...styles.base,
      ...styles[size],
      backgroundColor,
      borderColor,
      color: textColor,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        borderWidth: 1,
      };
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          {...textInputProps}
          style={[
            getInputStyles(),
            leftIcon && styles.withLeftIcon,
            rightIcon && styles.withRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <ThemedText 
          style={[styles.helperText, error && { color: errorColor }]}
        >
          {error || helperText}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    fontFamily: 'System',
    fontSize: Typography.sizes.base,
  },
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.sm,
  },
  md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.base,
  },
  lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    fontSize: Typography.sizes.lg,
  },
  withLeftIcon: {
    paddingLeft: 44,
  },
  withRightIcon: {
    paddingRight: 44,
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
  },
  helperText: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.sm,
  },
});