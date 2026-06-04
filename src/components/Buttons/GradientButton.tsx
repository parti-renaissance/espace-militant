import { LinearGradient } from '@tamagui/linear-gradient'
import { Button, ButtonProps } from 'tamagui'

export default function GradientButton({ children, round, ...rest }: ButtonProps & { round?: boolean }) {
  return (
    <LinearGradient borderRadius={round ? '$9' : 9} colors={['$blue4', '$pink6', '$blue4', '$pink6', '$blue4']} start={[1, 1]} end={[0, 0]} p={2}>
      <Button
        variant={'outlined'}
        borderWidth={0}
        backgroundColor="$white1"
        borderRadius={round ? '$8' : 8}
        hoverStyle={{
          backgroundColor: '$white1',
        }}
        pressStyle={{
          backgroundColor: '$white/48',
        }}
        {...rest}
      >
        {children}
      </Button>
    </LinearGradient>
  )
}
