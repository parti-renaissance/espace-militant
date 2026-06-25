import fs from 'node:fs'
import gal from 'google-auth-library'

const { GoogleAuth } = gal

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
console.log('=== firebase auth debug ===')
console.log('creds file present:', Boolean(credPath && fs.existsSync(credPath)))

try {
  const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  console.log('TOKEN MINT OK — access_token length =', (token?.token || '').length)
} catch (e) {
  const detail = e?.response?.data ?? e?.message ?? String(e)
  console.error('TOKEN MINT FAILED:', typeof detail === 'string' ? detail : JSON.stringify(detail))
}
