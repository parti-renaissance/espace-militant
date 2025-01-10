import * as WebBrowser from 'expo-web-browser'

export const ExternalLink = {
  openUrl: async (url: string) => {
    await WebBrowser.openBrowserAsync(url)
  },
}
