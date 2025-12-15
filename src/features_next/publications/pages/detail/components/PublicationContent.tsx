import React, { useState, useEffect, useRef } from 'react'
import { RefreshControl } from 'react-native'
import { YStack, XStack, useMedia, isWeb } from 'tamagui'
import Text from '@/components/base/Text'
import { RestGetMessageContentResponse, RestGetMessageResponse, RestGetMessageFiltersResponse } from '@/services/publications/schema'
import PublicationCard from '@/components/Cards/PublicationCard/PublicationCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useLocalSearchParams } from 'expo-router'
import { Eye, PieChart, Sparkle } from '@tamagui/lucide-icons'
import CongratulationsModal from '../../../components/CongratulationsModal'
import { RestPublicationStatsResponse } from '@/services/stats/schema'
import PublicationGlobalStatsCards from './PublicationGlobalStatsCards'
import BreadCrumbV2 from '@/components/BreadCrumb/BreadCrumbV2'
import { FiltersChips, FilterValue } from '../../../components/FiltersChips'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { ContentBackButton } from '@/components/ContentBackButton'

interface PublicationContentProps {
  data: RestGetMessageResponse
  content?: RestGetMessageContentResponse
  stats?: RestPublicationStatsResponse
  filters?: RestGetMessageFiltersResponse
  onRefreshStats?: () => void
  isRefreshingStats?: boolean
}

export function PublicationContent({ data, stats, filters, onRefreshStats, isRefreshingStats }: PublicationContentProps) {
  const params = useLocalSearchParams<{ congratulations?: string; section?: string }>()
  const media = useMedia()
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [activeSection, setActiveSection] = useState<'read' | 'stats'>('read')
  const statsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (params.congratulations) {
      setShowCongratulations(true)
    }
  }, [params.congratulations])

  useEffect(() => {
    if (params.section === 'stats' && stats) {
      setActiveSection('stats')
      
      // Scroll vers la section stats sur le web
      if (isWeb) {
        // Mettre à jour l'URL avec le hash
        if (typeof window !== 'undefined' && !window.location.hash.includes('publication-stats')) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#publication-stats`)
        }
        
        setTimeout(() => {
          const element = document.getElementById('publication-stats')
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }, 100)
      }
    }
  }, [params.section, stats])

  const handleCloseCongratulations = () => {
    setShowCongratulations(false)
  }

  return (
    <Layout.Main>
      {(stats && media.sm) && (
        <YStack gap="$medium">
          <BreadCrumbV2 items={[{ id: "read", label: 'Lecture', icon: Eye }, { id: "stats", label: 'Statistiques', icon: PieChart, color: '$purple5' }]} value={activeSection} onChange={(v) => { setActiveSection(v as 'read' | 'stats') }} />
        </YStack>
      )}
      <LayoutScrollView 
        refreshControl={
          stats && onRefreshStats ? (
            <RefreshControl refreshing={isRefreshingStats || false} onRefresh={onRefreshStats} />
          ) : undefined
        }
      >
        <YStack gap="$medium" width="100%" marginHorizontal="auto" paddingBottom={100}>
          <ContentBackButton fallbackPath="/publications" />
          {
            (activeSection === 'read' || media.gtSm) && (
              <YStack gap="$medium" pt={media.sm ? '$medium' : 0}>
                <PublicationCard
                  showFullContent={true}
                  title={data.subject}
                  description={data?.json_content}
                  author={data.sender}
                  uuid={data.uuid}
                />
                {filters && (
                  <VoxCard gap="$medium" bg="$textOutline" mt="$medium">
                    <VoxCard.Content>
                      <Text.SM medium>À qui cette publication est-elle adressée ?</Text.SM>
                      <FiltersChips selectedFilters={filters as Record<string, FilterValue>} isStatic />
                    </VoxCard.Content>
                  </VoxCard>
                )}
              </YStack>
            )
          }

          {stats && (activeSection === 'stats' || media.gtSm) && (
            <YStack 
              id="publication-stats"
              ref={statsSectionRef as React.RefObject<any>}
              gap={media.sm ? 0 : "$medium"} 
              pt={media.sm ? 0 : '$large'}
            >
              <XStack gap="$small" px="$medium" display={media.sm ? 'none' : 'flex'}>
                <PieChart size={20} />
                <Text.LG semibold>Statistiques de publication</Text.LG>
              </XStack>
              <VoxCard bg="$purple1" borderWidth={0}>
                <VoxCard.Content>
                  <XStack gap="$medium" alignItems="center">
                    <Text.SM color="$purple6">
                      Vous pouvez voir ces statistiques uniquement car vous êtes Cadre avec un rôle au sein de l'instance qui l'a envoyée.
                    </Text.SM>
                    <YStack>
                      <Sparkle size={20} color="$purple6" />
                    </YStack>
                  </XStack>

                </VoxCard.Content>
              </VoxCard>
              <PublicationGlobalStatsCards stats={stats} />
            </YStack>
          )
          }
        </YStack>
        <CongratulationsModal isOpen={showCongratulations} onClose={handleCloseCongratulations} />
      </LayoutScrollView>
    </Layout.Main>
  )
}

