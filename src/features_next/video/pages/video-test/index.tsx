import { useCallback, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Input, isWeb, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ExternalLink, Film, Video } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Switch from '@/components/base/SwitchV2/SwitchV2'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import VideoPlayer from '@/features_next/video/components/VideoPlayer'

import { GenericResponseError } from '@/services/common/errors/generic-errors'
import { useVideo } from '@/services/video/hook'

const SAMPLE_VIDEOS = [
  { label: 'Portrait 9:16 720p', uuid: '550e8400-e29b-41d4-a716-446655440001' },
  { label: 'Portrait 9:16 1080p', uuid: '550e8400-e29b-41d4-a716-446655440000' },
  { label: 'Carré 1:1 1080p', uuid: '550e8400-e29b-41d4-a716-446655440002' },
] as const

type VideoTestControlsProps = {
  inputUuid: string
  queryUuid: string
  autoPlay: boolean
  loop: boolean
  onInputUuidChange: (value: string) => void
  onLoad: () => void
  onRefresh: () => void
  onLoadSample: (uuid: string) => void
  onAutoPlayChange: (value: boolean) => void
  onLoopChange: (value: boolean) => void
}

function VideoTestControls({
  inputUuid,
  queryUuid,
  autoPlay,
  loop,
  onInputUuidChange,
  onLoad,
  onRefresh,
  onLoadSample,
  onAutoPlayChange,
  onLoopChange,
}: VideoTestControlsProps) {
  return (
    <YStack gap="$medium">
      <VoxCard>
        <VoxCard.Content gap="$medium" padding="$medium">
          <Text semibold>Identifiant</Text>
          <Input
            placeholder="UUID retourné par votre back-office ou l’API"
            value={inputUuid}
            onChangeText={onInputUuidChange}
            autoCapitalize="none"
            autoCorrect={false}
            width="100%"
            borderWidth={1}
            borderColor="$textOutline"
            borderRadius="$medium"
            paddingHorizontal="$medium"
            paddingVertical="$small"
          />
          <XStack gap="$small" flexWrap="wrap">
            <VoxButton iconLeft={Film} onPress={onLoad} disabled={!inputUuid.trim()}>
              Charger
            </VoxButton>
            {queryUuid ? (
              <VoxButton variant="outlined" onPress={onRefresh}>
                Rafraîchir
              </VoxButton>
            ) : null}
          </XStack>
        </VoxCard.Content>
      </VoxCard>

      <VoxCard>
        <VoxCard.Content gap="$medium" padding="$medium">
          <Text semibold>Vidéos de démo</Text>
          <YStack gap="$small">
            {SAMPLE_VIDEOS.map((sample) => (
              <VoxButton key={sample.uuid} variant={queryUuid === sample.uuid ? 'contained' : 'outlined'} onPress={() => onLoadSample(sample.uuid)}>
                {sample.label}
              </VoxButton>
            ))}
          </YStack>
        </VoxCard.Content>
      </VoxCard>

      <VoxCard>
        <VoxCard.Content gap="$medium" padding="$medium">
          <Text semibold>Réglages</Text>
          <YStack gap="$small">
            <XStack alignItems="center" justifyContent="space-between" gap="$small">
              <YStack flex={1} gap="$xsmall">
                <Text.MD multiline>Lecture automatique</Text.MD>
                <Text.SM secondary>La vidéo démarre sans appuyer sur play</Text.SM>
              </YStack>
              <Switch checked={autoPlay} onPress={() => onAutoPlayChange(!autoPlay)} aria-label="Lecture automatique" />
            </XStack>
            <XStack alignItems="center" justifyContent="space-between" gap="$small">
              <YStack flex={1} gap="$xsmall">
                <Text.MD multiline>Lecture en boucle</Text.MD>
                <Text.SM secondary>La vidéo redémarre à la fin</Text.SM>
              </YStack>
              <Switch checked={loop} onPress={() => onLoopChange(!loop)} aria-label="Lecture en boucle" />
            </XStack>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </YStack>
  )
}

function VideoEmptyPlaceholder() {
  return (
    <YStack
      width="100%"
      aspectRatio={16 / 9}
      borderRadius={8}
      borderWidth={1}
      borderColor="$textOutline"
      borderStyle="dashed"
      backgroundColor="$textSurface"
      alignItems="center"
      justifyContent="center"
      gap="$small"
      padding="$medium"
    >
      <Video size={32} color="$textDisabled" />
      <Text semibold textAlign="center">
        Aucune vidéo sélectionnée
      </Text>
      <Text.SM secondary textAlign="center">
        Choisissez une vidéo de démo ou chargez un UUID pour afficher le lecteur.
      </Text.SM>
    </YStack>
  )
}

export default function VideoTestPage() {
  const media = useMedia()
  const [inputUuid, setInputUuid] = useState('')
  const [queryUuid, setQueryUuid] = useState('')
  const [autoPlay, setAutoPlay] = useState(false)
  const [loop, setLoop] = useState(true)

  const { data, isPending, isFetching, error, refetch, isError } = useVideo(queryUuid || undefined, {
    enabled: queryUuid.length > 0,
  })

  const load = useCallback(() => {
    setQueryUuid(inputUuid.trim())
  }, [inputUuid])

  const loadSample = useCallback((uuid: string) => {
    setInputUuid(uuid)
    setQueryUuid(uuid)
  }, [])

  const openUrl = useCallback((url: string) => {
    void WebBrowser.openBrowserAsync(url)
  }, [])

  const errorMessage = error instanceof GenericResponseError ? error.message : error instanceof Error ? error.message : isError ? 'Échec du chargement' : null
  const isLoading = Boolean(queryUuid) && (isPending || isFetching) && !data

  const controlsProps = {
    inputUuid,
    queryUuid,
    autoPlay,
    loop,
    onInputUuidChange: setInputUuid,
    onLoad: load,
    onRefresh: () => void refetch(),
    onLoadSample: loadSample,
    onAutoPlayChange: setAutoPlay,
    onLoopChange: setLoop,
  }

  return (
    <>
      <Layout.Main>
        <LayoutScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          <YStack gap="$medium" width="100%" paddingTop="$medium">
            <YStack gap="$xsmall">
              <Text.LG semibold>Test API vidéo</Text.LG>
              <Text secondary>
                GET authentifié <Text semibold>/videos/&#123;uuid&#125;</Text> — saisissez l’UUID d’une vidéo
              </Text>
            </YStack>

            {!media.gtMd ? <VideoTestControls {...controlsProps} /> : null}

            <VoxCard>
              <VoxCard.Content gap="$medium" padding="$medium">
                {!queryUuid ? (
                  <VideoEmptyPlaceholder />
                ) : isLoading ? (
                  <YStack width="100%" aspectRatio={16 / 9} alignItems="center" justifyContent="center" gap="$small">
                    <Spinner size="small" />
                    <Text secondary>Chargement…</Text>
                  </YStack>
                ) : errorMessage ? (
                  <YStack width="100%" aspectRatio={16 / 9} alignItems="center" justifyContent="center" padding="$medium">
                    <Text.LG semibold color="$red10" role="alert" textAlign="center">
                      {errorMessage}
                    </Text.LG>
                  </YStack>
                ) : data ? (
                  <YStack gap="$medium">
                    <YStack gap="$xsmall">
                      <Text semibold>{data.title}</Text>
                      <Text.SM secondary>
                        {data.width}×{data.height} · {data.duration}s · {data.uuid}
                      </Text.SM>
                    </YStack>

                    <VideoPlayer
                      key={`${data.hls_url}-${autoPlay}-${loop}`}
                      hlsUrl={data.hls_url}
                      thumbnailUrl={data.thumbnail_url}
                      width={data.width}
                      height={data.height}
                      {...(autoPlay ? { startActivated: true, shouldPlay: true } : {})}
                      loop={loop}
                    />

                    {!isWeb ? (
                      <YStack gap="$small">
                        <Text.SM semibold>Ouvrir dans le navigateur</Text.SM>
                        <Text.SM secondary>Liens bruts (mobile).</Text.SM>
                        <XStack gap="$small" flexWrap="wrap">
                          <VoxButton size="sm" variant="soft" iconLeft={ExternalLink} onPress={() => openUrl(data.hls_url)}>
                            Manifest HLS
                          </VoxButton>
                          <VoxButton size="sm" variant="soft" iconLeft={ExternalLink} onPress={() => openUrl(data.thumbnail_url)}>
                            Vignette
                          </VoxButton>
                        </XStack>
                      </YStack>
                    ) : null}
                  </YStack>
                ) : null}
              </VoxCard.Content>
            </VoxCard>
          </YStack>
        </LayoutScrollView>
      </Layout.Main>

      {media.gtMd ? (
        <Layout.SideBar isSticky padding="right">
          <VideoTestControls {...controlsProps} />
        </Layout.SideBar>
      ) : null}
    </>
  )
}
