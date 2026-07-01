import { Href, Link } from 'expo-router';
import { YStack } from 'tamagui';
import { Zap } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';
import { IconComponent } from '@/models/common.model';

type PronoCtaSectionProps = {
  label: string
  href?: Href
  onPress?: () => void
  icon?: IconComponent
  backgroundColor?: string
  textColor?: string
  hoverColor?: string
  pressColor?: string
}

export default function PronoCtaSection({
  label,
  href,
  onPress,
  icon = Zap,
  backgroundColor = '#4555D1',
  textColor = 'white',
  hoverColor = '#3a48b0',
  pressColor = '#3a48b0',
}: PronoCtaSectionProps) {
  const button = (
    <VoxButton
      variant="contained"
      size="xl"
      iconLeft={icon}
      full
      backgroundColor={backgroundColor}
      textColor={textColor}
      hoverStyle={{ backgroundColor: hoverColor }}
      pressStyle={{ backgroundColor: pressColor }}
      onPress={onPress}
    >
      {label}
    </VoxButton>
  )

  return <YStack gap="$small">{href && !onPress ? <Link href={href} asChild>{button}</Link> : button}</YStack>
}
