import fs from 'node:fs'
import gal from 'google-auth-library'

const { GoogleAuth } = gal

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
console.log('=== firebase auth debug ===')
console.log('GOOGLE_APPLICATION_CREDENTIALS =', credPath || '(unset)')

if (credPath && fs.existsSync(credPath)) {
  const raw = fs.readFileSync(credPath, 'utf8')
  console.log('creds file size:', raw.length, 'bytes')
  try {
    const j = JSON.parse(raw)
    // Print non-secret fields only (never the private_key itself).
    console.log(
      'creds (non-secret fields):',
      JSON.stringify(
        {
          type: j.type,
          project_id: j.project_id,
          client_email: j.client_email,
          // truncated on purpose: this repo is public, the key id is metadata
          // we only need its prefix to compare against the key present in GCP.
          private_key_id_prefix: j.private_key_id ? `${String(j.private_key_id).slice(0, 8)}…` : null,
          token_uri: j.token_uri,
          has_private_key: Boolean(j.private_key),
        },
        null,
        2,
      ),
    )
  } catch (e) {
    console.error('creds file is NOT valid JSON:', e.message)
  }
} else {
  console.error('creds file MISSING or path unset')
}

try {
  const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  console.log('TOKEN MINT OK — access_token length =', (token?.token || '').length)
} catch (e) {
  // This is exactly what firebase-tools hides behind "Failed to authenticate".
  const detail = e?.response?.data ?? e?.message ?? String(e)
  console.error('TOKEN MINT FAILED — real error from the OAuth token endpoint:')
  console.error(typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2))
  if (e?.stack) console.error(e.stack)
}
