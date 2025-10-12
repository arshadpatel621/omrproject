import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BackgroundPatternsProps {
  variant?: 'dots' | 'grid' | 'waves' | 'hexagons' | 'education' | 'bubbles';
  intensity?: number;
  animated?: boolean;
}

export function BackgroundPatterns({ 
  variant = 'dots', 
  intensity = 0.05,
  animated = true
}: BackgroundPatternsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = useThemeColor({}, 'primary');
  
  const animationValue = useSharedValue(0);
  
  React.useEffect(() => {
    if (animated) {
      animationValue.value = withRepeat(
        withTiming(1, {
          duration: 20000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [animated]);

  const dotColor = isDark 
    ? `rgba(255, 255, 255, ${intensity})` 
    : `rgba(0, 0, 0, ${intensity})`;
  
  const accentColor = isDark 
    ? `rgba(255, 255, 255, ${intensity * 2})` 
    : `rgba(0, 0, 0, ${intensity * 2})`;

  const renderPattern = () => {
    switch (variant) {
      case 'dots':
        return <DotsPattern dotColor={dotColor} animationValue={animationValue} />;
      case 'grid':
        return <GridPattern lineColor={dotColor} animationValue={animationValue} />;
      case 'waves':
        return <WavesPattern waveColor={dotColor} animationValue={animationValue} />;
      case 'hexagons':
        return <HexagonPattern hexColor={dotColor} animationValue={animationValue} />;
      case 'education':
        return <EducationPattern shapeColor={dotColor} animationValue={animationValue} />;
      case 'bubbles':
        return <BubblesPattern bubbleColor={accentColor} animationValue={animationValue} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {renderPattern()}
    </View>
  );
}

// Individual pattern components
function DotsPattern({ dotColor, animationValue }: { dotColor: string; animationValue: Animated.SharedValue<number> }) {
  const dots = [];
  const spacing = 40;
  const cols = Math.ceil(SCREEN_WIDTH / spacing) + 2;
  const rows = Math.ceil(SCREEN_HEIGHT / spacing) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const animatedStyle = useAnimatedStyle(() => {
        const delay = (row + col) * 0.1;
        const progress = (animationValue.value + delay) % 1;
        const scale = interpolate(progress, [0, 0.5, 1], [1, 1.2, 1]);
        const opacity = interpolate(progress, [0, 0.5, 1], [0.3, 1, 0.3]);
        
        return {
          transform: [{ scale }],
          opacity,
        };
      });

      dots.push(
        <Animated.View
          key={`${row}-${col}`}
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              left: col * spacing - 10,
              top: row * spacing - 10,
            },
            animatedStyle,
          ]}
        />
      );
    }
  }

  return <>{dots}</>;
}

function GridPattern({ lineColor, animationValue }: { lineColor: string; animationValue: Animated.SharedValue<number> }) {
  const lines = [];
  const spacing = 50;
  
  // Vertical lines
  for (let i = 0; i <= SCREEN_WIDTH / spacing; i++) {
    const animatedStyle = useAnimatedStyle(() => {
      const delay = i * 0.05;
      const progress = (animationValue.value + delay) % 1;
      const opacity = interpolate(progress, [0, 0.5, 1], [0.2, 0.6, 0.2]);
      
      return { opacity };
    });

    lines.push(
      <Animated.View
        key={`v-${i}`}
        style={[
          styles.verticalLine,
          {
            backgroundColor: lineColor,
            left: i * spacing,
          },
          animatedStyle,
        ]}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= SCREEN_HEIGHT / spacing; i++) {
    const animatedStyle = useAnimatedStyle(() => {
      const delay = i * 0.05;
      const progress = (animationValue.value + delay) % 1;
      const opacity = interpolate(progress, [0, 0.5, 1], [0.2, 0.6, 0.2]);
      
      return { opacity };
    });

    lines.push(
      <Animated.View
        key={`h-${i}`}
        style={[
          styles.horizontalLine,
          {
            backgroundColor: lineColor,
            top: i * spacing,
          },
          animatedStyle,
        ]}
      />
    );
  }

  return <>{lines}</>;
}

function WavesPattern({ waveColor, animationValue }: { waveColor: string; animationValue: Animated.SharedValue<number> }) {
  const waves = [];
  const waveCount = 5;
  
  for (let i = 0; i < waveCount; i++) {
    const animatedStyle = useAnimatedStyle(() => {
      const delay = i * 0.2;
      const progress = (animationValue.value + delay) % 1;
      const translateY = interpolate(progress, [0, 1], [0, -20]);
      const opacity = interpolate(progress, [0, 0.5, 1], [0.3, 0.8, 0.3]);
      
      return {
        transform: [{ translateY }],
        opacity,
      };
    });

    waves.push(
      <Animated.View
        key={i}
        style={[
          styles.wave,
          {
            backgroundColor: waveColor,
            bottom: i * 100,
          },
          animatedStyle,
        ]}
      />
    );
  }

  return <>{waves}</>;
}

function HexagonPattern({ hexColor, animationValue }: { hexColor: string; animationValue: Animated.SharedValue<number> }) {
  const hexagons = [];
  const spacing = 80;
  const cols = Math.ceil(SCREEN_WIDTH / spacing);
  const rows = Math.ceil(SCREEN_HEIGHT / spacing);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offsetX = (row % 2) * (spacing / 2);
      const animatedStyle = useAnimatedStyle(() => {
        const delay = (row + col) * 0.15;
        const progress = (animationValue.value + delay) % 1;
        const rotate = interpolate(progress, [0, 1], [0, 360]);
        const scale = interpolate(progress, [0, 0.5, 1], [1, 1.1, 1]);
        
        return {
          transform: [{ rotate: `${rotate}deg` }, { scale }],
        };
      });

      hexagons.push(
        <Animated.View
          key={`${row}-${col}`}
          style={[
            styles.hexagon,
            {
              backgroundColor: hexColor,
              left: col * spacing + offsetX - 20,
              top: row * (spacing * 0.75) - 20,
            },
            animatedStyle,
          ]}
        />
      );
    }
  }

  return <>{hexagons}</>;
}

function EducationPattern({ shapeColor, animationValue }: { shapeColor: string; animationValue: Animated.SharedValue<number> }) {
  const shapes = [];
  const bookPositions = [
    { x: 50, y: 100, rotation: 15 },
    { x: SCREEN_WIDTH - 100, y: 200, rotation: -10 },
    { x: 80, y: SCREEN_HEIGHT - 150, rotation: 20 },
    { x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 100, rotation: -15 },
    { x: SCREEN_WIDTH / 2, y: 150, rotation: 5 },
  ];

  bookPositions.forEach((pos, index) => {
    const animatedStyle = useAnimatedStyle(() => {
      const delay = index * 0.3;
      const progress = (animationValue.value + delay) % 1;
      const translateY = interpolate(progress, [0, 0.5, 1], [0, -10, 0]);
      const rotate = pos.rotation + interpolate(progress, [0, 1], [0, 5]);
      const opacity = interpolate(progress, [0, 0.5, 1], [0.4, 0.8, 0.4]);
      
      return {
        transform: [
          { translateY },
          { rotate: `${rotate}deg` }
        ],
        opacity,
      };
    });

    shapes.push(
      <Animated.View
        key={`book-${index}`}
        style={[
          styles.book,
          {
            backgroundColor: shapeColor,
            left: pos.x,
            top: pos.y,
          },
          animatedStyle,
        ]}
      />
    );
  });

  return <>{shapes}</>;
}

function BubblesPattern({ bubbleColor, animationValue }: { bubbleColor: string; animationValue: Animated.SharedValue<number> }) {
  const bubbles = [];
  const bubbleCount = 15;

  for (let i = 0; i < bubbleCount; i++) {
    const size = Math.random() * 40 + 20;
    const x = Math.random() * (SCREEN_WIDTH - size);
    const y = Math.random() * (SCREEN_HEIGHT - size);
    
    const animatedStyle = useAnimatedStyle(() => {
      const delay = i * 0.2;
      const progress = (animationValue.value + delay) % 1;
      const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
      const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0.2, 0.8, 0.8, 0.2]);
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    bubbles.push(
      <Animated.View
        key={i}
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            width: size,
            height: size,
            borderRadius: size / 2,
            left: x,
            top: y,
          },
          animatedStyle,
        ]}
      />
    );
  }

  return <>{bubbles}</>;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 30,
  },
  hexagon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  book: {
    position: 'absolute',
    width: 30,
    height: 40,
    borderRadius: 4,
  },
  bubble: {
    position: 'absolute',
  },
});