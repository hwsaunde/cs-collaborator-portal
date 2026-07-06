const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not configured' })

  try {
    const cols = 'user_id,name,role,bio,email,location,instagram,avatar_url,is_public,updated_at'
    const r = await fetch(`${SB_URL}/rest/v1/collaborator_profiles?select=${cols}&limit=200`, {
      headers: {
        apikey: SB_SERVICE_KEY,
        Authorization: `Bearer ${SB_SERVICE_KEY}`
      }
    })
    const data = await r.json()
    if (!Array.isArray(data)) {
      return res.status(500).json({ error: 'Supabase returned non-array', sbStatus: r.status, sbBody: data })
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
