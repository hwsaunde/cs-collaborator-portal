const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY not configured' })

  const { dataUrl, path } = req.body || {}
  if (!dataUrl || !path) return res.status(400).json({ error: 'Missing dataUrl or path' })

  // Parse data URL: data:image/jpeg;base64,....
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return res.status(400).json({ error: 'Invalid dataUrl format' })
  const mimeType = match[1]
  const base64Data = match[2]
  const buffer = Buffer.from(base64Data, 'base64')

  // Sanitize path — only allow alphanumeric, hyphens, underscores, slashes, dots
  const safePath = path.replace(/[^a-zA-Z0-9\-_\/\.]/g, '_')

  try {
    const uploadRes = await fetch(`${SB_URL}/storage/v1/object/creator-images/${safePath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SB_SERVICE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true',
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || 'Upload failed', status: uploadRes.status })
    }

    const publicUrl = `${SB_URL}/storage/v1/object/public/creator-images/${safePath}`
    return res.status(200).json({ url: publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
