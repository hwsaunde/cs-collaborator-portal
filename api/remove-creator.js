const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id } = req.body || {}
  if (!user_id) return res.status(400).json({ error: 'user_id required' })

  try {
    // Delete profile first (FK constraint), then auth user
    await fetch(`${SB_URL}/rest/v1/collaborator_profiles?user_id=eq.${user_id}`, {
      method: 'DELETE',
      headers: { apikey: SB_SERVICE_KEY, Authorization: `Bearer ${SB_SERVICE_KEY}` }
    })

    const authRes = await fetch(`${SB_URL}/auth/v1/admin/users/${user_id}`, {
      method: 'DELETE',
      headers: { apikey: SB_SERVICE_KEY, Authorization: `Bearer ${SB_SERVICE_KEY}` }
    })

    if (!authRes.ok && authRes.status !== 404) {
      const err = await authRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || 'Failed to delete auth user' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('remove-creator error:', err)
    return res.status(500).json({ error: err.message })
  }
}
