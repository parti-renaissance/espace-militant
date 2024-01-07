import * as FB from "@/config/firebaseConfig"
import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from "firebase/analytics"

export type AnalyticsScreens =
  | 'Accueil'
  | 'Actualités'
  | 'Actions'
  | 'Événements'
  | 'Ressources'

export const Analytics = {
  logScreen: async (screenName: string) => {
    // await analytics().logScreenView({
    //   screen_name: screenName,
    //   screen_class: screenName,
    // })
  },
  logUrlOpened: async (url: string) => {
    logEvent(FB.Analytics, 'external_link_opened', { url: url })
  },
  logNavBarItemSelected: async (screen: AnalyticsScreens) => {
    logEvent(FB.Analytics, 'nav_bar', {
      button_type: screen,
      interaction: 'nav_bar',
    })
  },
  logNewsOpen: async () => {
    logEvent(FB.Analytics, 'news', {
      button_type: 'open_news',
      interaction: 'open',
    })
  },
  logHomeNewsOpen: async () => {
    logEvent(FB.Analytics,'hero_news', {
      button_type: 'open_hero_news',
      interaction: 'open',
    })
  },
  // TODO: (Pierre Felgines) 2022/02/28 Delete this analytics once validated
  logHomeNewsMore: async () => {
    logEvent(FB.Analytics,'hero_news', {
      button_type: 'all_news',
      interaction: 'cta',
    })
  },
  // TODO: (Pierre Felgines) 2022/02/28 Delete this analytics once validated
  logHomeToolOpen: async (name: string) => {
    logEvent(FB.Analytics,'hero_tool', {
      button_type: name,
      interaction: 'cta',
    })
  },
  // TODO: (Pierre Felgines) 2022/02/28 Delete this analytics once validated
  logHomeToolsMore: async () => {
    logEvent(FB.Analytics,'hero_tool', {
      button_type: 'all_tools',
      interaction: 'cta',
    })
  },
  logHomeRegionMore: async () => {
    logEvent(FB.Analytics,'hero_article', {
      button_type: 'en_savoir_plus',
      interaction: 'cta',
    })
  },
  logHomeEventOpen: async (name: string, category: string) => {
    logEvent(FB.Analytics,'heroe', {
      button_type: name,
      event_category: category,
      interaction: 'cta',
    })
  },
  logRegionDetails: async () => {
    logEvent(FB.Analytics,'hero_article', {
      button_type: 'plus_de_detail',
      interaction: 'cta',
    })
  },
  logEventShare: async (eventName: string) => {
    logEvent(FB.Analytics,'share_events', {
      button_type: eventName,
      interaction: 'partage',
    })
  },
  logEventAddToCalendar: async (eventName: string) => {
    logEvent(FB.Analytics,'add_calendar', {
      button_type: eventName,
      interaction: 'rappel',
    })
  },
  logEventRegister: async (eventName: string) => {
    logEvent(FB.Analytics,'inscription_events', {
      button_type: eventName,
      interaction: 'inscription',
    })
  },
  logToolSelected: async (name: string) => {
    logEvent(FB.Analytics,'tool', {
      button_type: name,
      interaction: 'cta',
    })
  },
  logActionsPolls: async () => {
    logEvent(FB.Analytics,'questionnaire', {
      button_type: 'questionnaire',
      interaction: 'cta',
    })
  },
  logEventTabSelected: async (key: string) => {
    let button_type: string
    switch (key) {
      case 'home':
        button_type = 'menu_hero'
        break
      case 'calendar':
        button_type = 'menu_calendrier'
        break
      case 'myEvents':
        button_type = 'menu_mes_events'
        break
      default:
        return
    }
    logEvent(FB.Analytics,'menu_events', {
      button_type: button_type,
      interaction: 'menu',
    })
  },
  logEventSelected: async (name: string, category: string) => {
    logEvent(FB.Analytics,'events', {
      button_type: `open_${name}`,
      event_category: category,
      interaction: 'open',
    })
  },
  enable: async () => {
    setAnalyticsCollectionEnabled(FB.Analytics, true)
  },
  disable: async () => {
    setAnalyticsCollectionEnabled(FB.Analytics, false)
  },
}
