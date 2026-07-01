import gabrielBall from '../../assets/gabriel-attal-ball.png'
import PronoCtaSection from '../../components/PronoCtaSection'
import PronoHeroSection from '../../components/PronoHeroSection'
import PronoMatchCard from '../../components/PronoMatchCard'
import PronoNotice from '../../components/PronoNotice'
import PronoScreenShell from '../../components/PronoScreenShell'
import { useCurrentPronoMatch } from '../../hooks/useCurrentPronoMatch'
import { PRONO_MATCH_IMAGE, PRONO_PAGE_COPY } from '../../model'
import { getPronoCtaState } from '../../utils'

export default function PronoPublicScreen() {
  const { match, isLoading, isRefetching, refetch } = useCurrentPronoMatch()

  return (
    <PronoScreenShell onRefresh={refetch} refreshing={isRefetching}>
      <PronoHeroSection />
      {isLoading ? null : match ? (
        <>
          <PronoMatchCard match={match} image={gabrielBall} imageWidth={PRONO_MATCH_IMAGE.width} imageHeight={PRONO_MATCH_IMAGE.height} />
          {getPronoCtaState(match, Boolean(match.playerPrediction)) === 'awaiting_result' ? (
            <PronoNotice>{PRONO_PAGE_COPY.matchStarted}</PronoNotice>
          ) : (
            <PronoCtaSection label={PRONO_PAGE_COPY.cta} href="/prono/jouer" />
          )}
        </>
      ) : (
        <PronoNotice>{PRONO_PAGE_COPY.noMatch}</PronoNotice>
      )}
    </PronoScreenShell>
  )
}
