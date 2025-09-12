import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { View, } from 'tamagui';
import { LinearGradient  } from 'expo-linear-gradient';
import { TouchableHighlight } from 'react-native';
import Text from '../base/Text';

type FutureButtonProps = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Hauteur du bouton */
  size?: number;
  /** Durée d’un tour complet en ms */
  durationMs?: number;
  children?: React.ReactNode;
};

export default function FutureButton({
  label,
  children,
  onPress,
  disabled = false,
  durationMs = 3000,
}: Readonly<FutureButtonProps>) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: durationMs,
        easing: Easing.linear,
      }),
      -1, // Répéter indéfiniment
      false // Ne pas inverser
    );
  }, [durationMs, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      style={{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        overflow: 'hidden',
        padding: 2,
      }}
    >
      {/* Aura en rotation : on ANIME la View, PAS le gradient */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: 'absolute', backgroundColor: '#290A42' },
          { width: '150%', height: '400%' },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={['#290A42', '#8EC5FC', '#E0C3FC', '#A1FFCE', '#290A42']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        />
      </Animated.View>

      {/* Bouton au-dessus (statique) */}
      <TouchableHighlight
        onPress={onPress}
        disabled={disabled}
        style={{ borderRadius: 999, paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#290A42', alignItems: 'center', justifyContent: 'center' }}
        underlayColor="#3A185C"
        activeOpacity={0.7}
        aria-label={label}
      >
        {children || <Text.LG regular>{label}</Text.LG>}
      </TouchableHighlight>
    </View>
  );
}
