import { ComponentProps, useEffect, useState } from 'react'
import Text from '@/components/base/Text'
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

const calculateTimeLeft = (date: Date) => {
  const now = new Date()
  const difference = differenceInSeconds(date, now)

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = differenceInDays(date, now)
  const hours = differenceInHours(date, now) % 24
  const minutes = differenceInMinutes(date, now) % 60
  const seconds = difference % 60

  return { days, hours, minutes, seconds }
}

const EventLiveCountDown = ({ startDate, textProps }: { startDate: Date; textProps: ComponentProps<typeof Text> }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(startDate))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(startDate))
    }, 1000)

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  })

  return <Text.LG {...textProps}>Le live commence dans : {`${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}</Text.LG>
}

export default EventLiveCountDown
