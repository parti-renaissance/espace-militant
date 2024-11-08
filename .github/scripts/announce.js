const staging_url = 'https://staging-app.parti-renaissance.fr/'
const prod_url = 'https://app.parti-renaissance.fr/'

let displayUrl = process.env.URL.replace('"', '').replace('"', '')
if (displayUrl.includes('develop')) displayUrl = staging_url
if (displayUrl.includes('prod')) displayUrl = prod_url

const requestOptions = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    channel: '#app-livraison',
    text: `Déploiement terminé du projet mobile (${process.env.BRANCH_NAME}) sur : ${displayUrl}}`,
  }),
}

fetch(process.env.SLACK_WEBHOOK_URL, requestOptions)
