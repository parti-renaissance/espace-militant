import { TextInput } from 'react-native'
import { styled, View, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import { PronoScore, PronoTeam } from '../model'

export type EditableScore = { home?: number; away?: number }

const HIGHLIGHT_COLOR = '#4555D1'
const SCORE_TEXT_COLOR = '#27221F'
const MAX_SCORE = 10

const clampScore = (value: number) => Math.max(0, Math.min(MAX_SCORE, value))

const parseScore = (text: string) => {
  const digits = text.replace(/[^0-9]/g, '')
  return digits ? clampScore(parseInt(digits, 10)) : 0
}

const DescriptionCard = styled(YStack, {
  width: '100%',
  height: 176,
  backgroundColor: '#D8DCFF',
  borderRadius: '$7',
  padding: '$medium',
  zIndex: 1,
})

const InnerCard = styled(XStack, {
  flex: 1,
  backgroundColor: '#F5F6FF',
  borderRadius: 16,
  paddingHorizontal: '$medium',
  alignItems: 'center',
  justifyContent: 'space-around',
})

const ScoreBox = styled(View, {
  width: 56,
  height: 64,
  borderRadius: 12,
  backgroundColor: '$white1',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    highlighted: {
      true: {
        borderWidth: 2,
        borderColor: HIGHLIGHT_COLOR,
      },
    },
  } as const,
})

type ScoreCellProps = {
  code: string
  value?: number
  highlighted?: boolean
  editable?: boolean
  onChangeValue?: (value: number) => void
}

function ScoreCell({ code, value, highlighted, editable, onChangeValue }: ScoreCellProps) {
  return (
    <YStack alignItems="center" gap="$xsmall">
      <ScoreBox highlighted={highlighted}>
        {editable ? (
          <TextInput
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChangeValue?.(parseScore(text))}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 32, fontWeight: '700', color: SCORE_TEXT_COLOR }}
          />
        ) : (
          <Text bold fontSize={32} color={SCORE_TEXT_COLOR}>
            {value ?? '–'}
          </Text>
        )}
      </ScoreBox>
      <Text.SM semibold color={SCORE_TEXT_COLOR}>
        {code}
      </Text.SM>
    </YStack>
  )
}

type PronoGroupProps = {
  title: string
  homeTeam: PronoTeam
  awayTeam: PronoTeam
  prediction?: EditableScore
  highlighted?: boolean
  editable?: boolean
  onChange?: (prediction: EditableScore) => void
}

function PronoGroup({ title, homeTeam, awayTeam, prediction, highlighted, editable, onChange }: PronoGroupProps) {
  return (
    <YStack alignItems="center" gap="$small">
      <Text.MD semibold color={SCORE_TEXT_COLOR}>
        {title}
      </Text.MD>
      <XStack alignItems="flex-start" gap="$xsmall">
        <ScoreCell
          code={homeTeam.code}
          value={prediction?.home}
          highlighted={highlighted}
          editable={editable}
          onChangeValue={(home) => onChange?.({ home, away: prediction?.away })}
        />
        <Text bold fontSize={20} lineHeight={64} color={SCORE_TEXT_COLOR}>
          -
        </Text>
        <ScoreCell
          code={awayTeam.code}
          value={prediction?.away}
          highlighted={highlighted}
          editable={editable}
          onChangeValue={(away) => onChange?.({ home: prediction?.home, away })}
        />
      </XStack>
    </YStack>
  )
}

type PronoPronosticsCardProps = {
  homeTeam: PronoTeam
  awayTeam: PronoTeam
  authorPrediction?: PronoScore
  playerPrediction?: EditableScore
  onPlayerChange?: (prediction: EditableScore) => void
  locked?: boolean
}

export default function PronoPronosticsCard({ homeTeam, awayTeam, authorPrediction, playerPrediction, onPlayerChange, locked }: PronoPronosticsCardProps) {
  return (
    <DescriptionCard>
      <InnerCard>
        <PronoGroup title="Prono. de Gabriel :" homeTeam={homeTeam} awayTeam={awayTeam} prediction={authorPrediction} />
        <Text bold fontSize={16} color="$textPrimary">
          VS
        </Text>
        <PronoGroup
          title="Ton pronostic :"
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          prediction={playerPrediction}
          highlighted={!locked}
          editable={!locked}
          onChange={onPlayerChange}
        />
      </InnerCard>
    </DescriptionCard>
  )
}
