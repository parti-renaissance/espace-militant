import { ImageSourcePropType } from 'react-native'
import { RetaliationSiteType } from '../../core/entities/Retaliation'

import facebookImg from '../../assets/images/facebook.png'
import twitterImg from '../../assets/images/twitter.png'
import otherSocialNetworkImg from '../../assets/images/otherSocialNetwork.png'

export const RetaliationSocialIconImageMapper = {
  map: (site: RetaliationSiteType): ImageSourcePropType => {
    switch (site) {
      case 'facebook':
        return facebookImg
      case 'twitter':
        return twitterImg
      case 'others':
        return otherSocialNetworkImg
    }
  },
}
