import { Href, Link } from 'expo-router';
import { YStack } from 'tamagui';
import { Zap } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';

type PronoCtaSectionProps = {
  label: string
  href: Href
}

export default function PronoCtaSection({ label, href }: PronoCtaSectionProps) {
  return (
    <YStack gap="$small">
      <Link href={href} asChild>
        <VoxButton
          variant="contained"
          size="xl"
          iconLeft={Zap}
          full
          backgroundColor="#4555D1"
          textColor="white"
          hoverStyle={{ backgroundColor: '#3a48b0' }}
          pressStyle={{ backgroundColor: '#3a48b0' }}
        >
          {label}
        </VoxButton>
      </Link>
    </YStack>
  )
}
