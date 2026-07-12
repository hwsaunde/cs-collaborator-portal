const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not configured' })

  const { user_id } = req.query
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

  try {
    const r = await fetch(`${SB_URL}/rest/v1/collaborator_profiles?user_id=eq.${encodeURIComponent(user_id)}&select=*&limit=1`, {
      headers: {
        apikey: SB_SERVICE_KEY,
        Authorization: `Bearer ${SB_SERVICE_KEY}`
      }
    })
    const data = await r.json()
    if (!Array.isArray(data) || !data[0]) {
      return res.status(404).json({ error: 'Creator not found' })
    }
    return res.status(200).json(data[0])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
