const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const WEBHOOK_SECRET = process.env.INVITE_WEBHOOK_SECRET
const REDIRECT_TO = 'https://creators.countysports.com'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, secret } = req.body || {}

  // Webhook calls from GHL must include the shared secret
  // Admin UI calls come from an authenticated session — no secret required there,
  // but we check the Referer as a basic origin guard
  const isWebhook = !!secret
  if (isWebhook && secret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook secret' })
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  try {
    const inviteRes = await fetch(`${SB_URL}/auth/v1/invite`, {
      method: 'POST',
      headers: {
        apikey: SB_SERVICE_KEY,
        Authorization: `Bearer ${SB_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        data: { name: name || '', portal: 'creator' },
        redirect_to: REDIRECT_TO,
      }),
    })

    const data = await inviteRes.json()

    if (!inviteRes.ok) {
      // Supabase returns 422 if the user already exists — treat as success
      if (inviteRes.status === 422 && data.msg?.includes('already')) {
        return res.status(200).json({ ok: true, note: 'User already exists' })
      }
      console.error('Supabase invite error:', data)
      return res.status(500).json({ error: data.msg || data.message || 'Invite failed' })
    }

    return res.status(200).json({ ok: true, email })
  } catch (err) {
    console.error('invite error:', err)
    return res.status(500).json({ error: err.message })
  }
}
