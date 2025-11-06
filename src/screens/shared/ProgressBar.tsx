import React from 'react'
import { Progress } from 'tamagui'

type Props = Readonly<{
  progress: number
  color: string
}>

const ProgressBar = (props: Props) => {
  const progressValue = Math.round(props.progress * 100)
  
  return (
    <Progress value={progressValue}>
      <Progress.Indicator bg={props.color} animation="bouncy" />
    </Progress>
  )
}

export default ProgressBar
