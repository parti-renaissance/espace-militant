import Text from '@/components/base/Text'

import jouerImage from '../../assets/gabriel-attal-jouer.png'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PRONO_PAGE_COPY } from '../../model'

export default function PronoPublicScreen() {
  const { match, isLoading } = useCurrentPronoMatch()

  return (
    <PronoScreenShell>
      <PronoHeroSection />
      {isLoading ? null : match ? (
        <>
          <PronoMatchCard match={match} image={jouerImage} imageWidth={300} imageHeight={409} />
          <PronoCtaSection label={PRONO_PAGE_COPY.cta} href="/prono/jouer" />
        </>
      ) : (
        <Text.MD semibold textAlign="center" color="#4555D1">
          Aucun pronostic disponible pour le moment.
        </Text.MD>
      )}
    </PronoScreenShell>
  )
}
