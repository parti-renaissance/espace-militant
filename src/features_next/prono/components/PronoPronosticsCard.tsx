import { useRef, type RefObject } from 'react'
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
  variants: {
    compact: {
      true: {
        height: 148,
      },
    },
  } as const,
})

const InnerCard = styled(XStack, {
  flex: 1,
  backgroundColor: '#F5F6FF',
  borderRadius: 16,
  paddingHorizontal: '$medium',
  alignItems: 'center',
  justifyContent: 'space-around',
  variants: {
    compact: {
      true: {
        paddingHorizontal: '$small',
        justifyContent: 'space-between',
      },
    },
  } as const,
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
    compact: {
      true: {
        width: 44,
        height: 56,
        borderRadius: 10,
      },
    },
  } as const,
})

type ScoreCellProps = {
  code: string
  value?: number
  highlighted?: boolean
  editable?: boolean
  valueColor?: string
  compact?: boolean
  onChangeValue?: (value: number) => void
  inputRef?: RefObject<TextInput | null>
  onFilled?: () => void
}

function ScoreCell({ code, value, highlighted, editable, valueColor = SCORE_TEXT_COLOR, compact, onChangeValue, inputRef, onFilled }: ScoreCellProps) {
  const fontSize = compact ? 26 : 32

  return (
    <YStack alignItems="center" gap="$xsmall">
      <ScoreBox highlighted={highlighted} compact={compact}>
        {editable ? (
          <TextInput
            ref={inputRef}
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => {
              onChangeValue?.(parseScore(text))
              if (text.replace(/[^0-9]/g, '') !== '') {
                onFilled?.()
              }
            }}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{ width: '100%', height: '100%', textAlign: 'center', fontSize, fontWeight: '700', color: valueColor }}
          />
        ) : (
          <Text bold fontSize={fontSize} color={valueColor}>
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
  scoreColor?: string
  compact?: boolean
  onChange?: (prediction: EditableScore) => void
}

function PronoGroup({ title, homeTeam, awayTeam, prediction, highlighted, editable, scoreColor, compact, onChange }: PronoGroupProps) {
  const separatorLineHeight = compact ? 56 : 64
  const awayInputRef = useRef<TextInput>(null)

  return (
    <YStack alignItems="center" gap="$small" flex={1} minWidth={0}>
      <Text.MD semibold color={SCORE_TEXT_COLOR} numberOfLines={1}>
        {title}
      </Text.MD>
      <XStack alignItems="flex-start" gap={compact ? 4 : '$xsmall'} justifyContent="center">
        <ScoreCell
          code={homeTeam.code}
          value={prediction?.home}
          highlighted={highlighted}
          editable={editable}
          valueColor={scoreColor}
          compact={compact}
          onChangeValue={(home) => onChange?.({ home, away: prediction?.away })}
          onFilled={() => awayInputRef.current?.focus()}
        />
        <Text bold fontSize={compact ? 18 : 20} lineHeight={separatorLineHeight} color={SCORE_TEXT_COLOR}>
          -
        </Text>
        <ScoreCell
          code={awayTeam.code}
          value={prediction?.away}
          highlighted={highlighted}
          editable={editable}
          valueColor={scoreColor}
          compact={compact}
          inputRef={awayInputRef}
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
  backgroundColor?: string
  innerBackgroundColor?: string
  authorScoreColor?: string
  playerScoreColor?: string
  compact?: boolean
}

export default function PronoPronosticsCard({
  homeTeam,
  awayTeam,
  authorPrediction,
  playerPrediction,
  onPlayerChange,
  locked,
  backgroundColor = '#D8DCFF',
  innerBackgroundColor = '#F5F6FF',
  authorScoreColor,
  playerScoreColor,
  compact,
}: PronoPronosticsCardProps) {
  return (
    <DescriptionCard backgroundColor={backgroundColor} compact={compact}>
      <InnerCard backgroundColor={innerBackgroundColor} compact={compact}>
        <PronoGroup title="Prono. de Gabriel :" homeTeam={homeTeam} awayTeam={awayTeam} prediction={authorPrediction} scoreColor={authorScoreColor} compact={compact} />
        <Text bold fontSize={16} color="$textPrimary" flexShrink={0} width={32} textAlign="center">
          VS
        </Text>
        <PronoGroup
          title="Ton pronostic :"
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          prediction={playerPrediction}
          highlighted={!locked}
          editable={!locked}
          scoreColor={playerScoreColor}
          compact={compact}
          onChange={onPlayerChange}
        />
      </InnerCard>
    </DescriptionCard>
  )
}
