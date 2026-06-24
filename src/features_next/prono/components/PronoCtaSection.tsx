import { Href, Link } from 'expo-router';
import { YStack } from 'tamagui';
import { Zap } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';

type PronoCtaSectionProps = {
  label: string
  href?: Href
  onPress?: () => void
}

export default function PronoCtaSection({ label, href, onPress }: PronoCtaSectionProps) {
  const button = (
    <VoxButton
      variant="contained"
      size="xl"
      iconLeft={Zap}
      full
      backgroundColor="#4555D1"
      textColor="white"
      hoverStyle={{ backgroundColor: '#3a48b0' }}
      pressStyle={{ backgroundColor: '#3a48b0' }}
      onPress={onPress}
    >
      {label}
    </VoxButton>
  )

  return <YStack gap="$small">{href && !onPress ? <Link href={href} asChild>{button}</Link> : button}</YStack>
}
