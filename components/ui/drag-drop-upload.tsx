import { AnimationDurations, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    interpolateColor,
    SlideInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface DragDropUploadProps {
  onFileSelect: (file: any) => void;
  onImageUrlChange: (url: string) => void;
  imageUrl: string;
  disabled?: boolean;
}

export function DragDropUpload({ 
  onFileSelect, 
  onImageUrlChange, 
  imageUrl, 
  disabled = false 
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');

  const scale = useSharedValue(1);
  const borderColorValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const animatedBorderColor = interpolateColor(
      borderColorValue.value,
      [0, 1],
      [borderColor, primaryColor]
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor: animatedBorderColor,
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${uploadProgress}%`,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    borderColorValue.value = withTiming(1, { duration: AnimationDurations.fast });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    borderColorValue.value = withTiming(0, { duration: AnimationDurations.fast });
  };

  const handlePress = () => {
    if (disabled) return;
    
    // Simulate file selection - in a real app, you'd use a file picker
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: () => handleImageSelection('camera') },
        { text: 'Gallery', onPress: () => handleImageSelection('gallery') },
        { text: 'URL', onPress: () => handleImageSelection('url') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImageSelection = (method: 'camera' | 'gallery' | 'url') => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setUploadStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate different image URLs based on method
    setTimeout(() => {
      const sampleUrls = {
        camera: 'https://picsum.photos/400/300?random=1',
        gallery: 'https://picsum.photos/400/300?random=2',
        url: 'https://picsum.photos/400/300?random=3',
      };
      
      onImageUrlChange(sampleUrls[method]);
      onFileSelect({ method, url: sampleUrls[method] });
    }, 1000);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <IconSymbol name="arrow.clockwise" size={24} color={primaryColor} />;
      case 'success':
        return <IconSymbol name="checkmark.circle.fill" size={24} color={successColor} />;
      case 'error':
        return <IconSymbol name="xmark.circle.fill" size={24} color={errorColor} />;
      default:
        return <IconSymbol name="plus.circle" size={24} color={primaryColor} />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Upload successful!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Choose File';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(AnimationDurations.normal)}
        style={[
          styles.uploadArea,
          {
            backgroundColor,
            borderColor,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={styles.pressableArea}
        >
          <View style={styles.content}>
            {getStatusIcon()}
            <Text style={[styles.title, { color: textColor }]}>
              {getStatusText()}
            </Text>
            <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
              Tap to select from camera, gallery, or enter URL
            </Text>
            
            {uploadStatus === 'uploading' && (
              <Animated.View 
                entering={SlideInDown.duration(AnimationDurations.normal)}
                style={styles.progressContainer}
              >
                <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
                  <Animated.View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: primaryColor },
                      progressAnimatedStyle
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: textSecondaryColor }]}>
                  {uploadProgress}%
                </Text>
              </Animated.View>
            )}
          </View>
        </Pressable>
      </Animated.View>

      {imageUrl && (
        <Animated.View 
          entering={FadeIn.delay(200).duration(AnimationDurations.normal)}
          style={styles.previewContainer}
        >
          <Text style={[styles.previewTitle, { color: textColor }]}>Preview</Text>
          <View style={[styles.imageContainer, { borderColor }]}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            {uploadStatus === 'success' && (
              <Animated.View 
                entering={FadeIn.delay(300)}
                style={[styles.successOverlay, { backgroundColor: successColor }]}
              >
                <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...Shadows.sm,
  },
  pressableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  progressBar: {
    height: 4,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  previewContainer: {
    marginTop: Spacing.lg,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  successOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
});
