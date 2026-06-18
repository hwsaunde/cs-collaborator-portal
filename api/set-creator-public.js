const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id, is_public } = req.body || {}
  if (!user_id || typeof is_public !== 'boolean') {
    return res.status(400).json({ error: 'user_id and is_public (boolean) required' })
  }

  try {
    const r = await fetch(`${SB_URL}/rest/v1/collaborator_profiles?user_id=eq.${user_id}`, {
      method: 'PATCH',
      headers: {
        apikey: SB_SERVICE_KEY,
        Authorization: `Bearer ${SB_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ is_public })
    })

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || 'Failed to update' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
