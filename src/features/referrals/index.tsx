import { useMedia } from 'tamagui'
import ReferralsDesktopScreen from './pages/ReferralsDesktopScreen'
import ReferralsMobileScreen from './pages/ReferralsMobileScreen'

const ReferralsScreen = () => {
  const media = useMedia()
  return media.gtSm ? <ReferralsDesktopScreen /> : <ReferralsMobileScreen />
}

export default ReferralsScreen