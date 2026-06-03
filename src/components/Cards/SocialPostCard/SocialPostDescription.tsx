import { useState } from 'react'

import Text from '@/components/base/Text'

const CHARACTER_LIMIT = 180

type SocialPostDescriptionProps = {
  description: string
}

const SocialPostDescription = ({ description }: SocialPostDescriptionProps) => {
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = description.length > CHARACTER_LIMIT && !expanded

  return (
    <Text.SM multiline>
      {shouldTruncate ? description.slice(0, CHARACTER_LIMIT) : description}
      {shouldTruncate && (
        <>
          <Text.SM>...</Text.SM>
          <Text.SM color="$blue6" semibold onPress={() => setExpanded(true)} cursor="pointer">
            {' Lire la suite'}
          </Text.SM>
        </>
      )}
    </Text.SM>
  )
}

export default SocialPostDescription
