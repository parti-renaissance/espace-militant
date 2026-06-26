import Text from '@/components/base/Text'

import gabrielBall from '../../assets/gabriel-attal-ball.png'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PRONO_MATCH_IMAGE, PRONO_PAGE_COPY } from '../../model'

export default function PronoPublicScreen() {
  const { match, isLoading, isRefetching, refetch } = useCurrentPronoMatch()

  return (
    <PronoScreenShell onRefresh={refetch} refreshing={isRefetching}>
      <PronoHeroSection />
      {isLoading ? null : match ? (
        <>
          <PronoMatchCard match={match} image={gabrielBall} imageWidth={PRONO_MATCH_IMAGE.width} imageHeight={PRONO_MATCH_IMAGE.height} />
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
