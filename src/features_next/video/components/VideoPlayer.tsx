// TODO: Installer expo-video (npx expo install expo-video) et remplacer la WebView + HTML HLS
// par VideoView pour la lecture native du flux hlsUrl sur iOS/Android.
import { useCallback, useMemo, useState } from 'react'
import { WebView } from 'react-native-webview'
import { Image } from 'expo-image'
import { Circle, YStack } from 'tamagui'
import { Play } from '@tamagui/lucide-icons'

import { getVideoAspectRatio, type VideoPlayerProps } from './VideoPlayer.types'

const buildHlsVideoHtml = (hlsUrl: string, loop = true) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; background: #000; }
      video { width: 100%; height: 100%; object-fit: contain; }
    </style>
  </head>
  <body>
    <video id="v" controls playsinline autoplay${loop ? ' loop' : ''}></video>
    <script>
      (function () {
        var src = ${JSON.stringify(hlsUrl)};
        var video = document.getElementById('v');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          return;
        }
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        }
      })();
    </script>
  </body>
</html>`

export default function VideoPlayer({ hlsUrl, thumbnailUrl, width, height, autoPlay = false, loop = true }: VideoPlayerProps) {
  const [playedHlsUrl, setPlayedHlsUrl] = useState<string | null>(autoPlay ? hlsUrl : null)
  const aspectRatio = getVideoAspectRatio(width, height)
  const showPoster = !autoPlay && playedHlsUrl !== hlsUrl
  const videoHtml = useMemo(() => buildHlsVideoHtml(hlsUrl, loop), [hlsUrl, loop])

  const handlePlay = useCallback(() => {
    setPlayedHlsUrl(hlsUrl)
  }, [hlsUrl])

  return (
    <YStack width="100%" borderRadius={8} overflow="hidden" backgroundColor="#000" style={{ aspectRatio }}>
      {showPoster ? (
        <YStack flex={1} position="relative" width="100%" height="100%">
          <Image source={{ uri: thumbnailUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(0,0,0,0.2)"
            onPress={handlePlay}
            role="button"
            aria-label="Lire la vidéo"
            pressStyle={{ opacity: 0.9 }}
          >
            <Circle size={64} backgroundColor="rgba(255,255,255,0.95)" alignItems="center" justifyContent="center">
              <Play size={28} color="$textPrimary" fill="currentColor" marginLeft={4} />
            </Circle>
          </YStack>
        </YStack>
      ) : (
        <WebView
          source={{ html: videoHtml }}
          style={{ flex: 1, backgroundColor: '#000' }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          scrollEnabled={false}
        />
      )}
    </YStack>
  )
}
