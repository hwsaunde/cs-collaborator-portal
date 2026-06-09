const ADMIN_EMAILS = ['henry@countysports.com', 'erik@countysports.com']
const FROM = 'County Sports <noreply@countysports.com>'
const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_KEY = process.env.SUPABASE_SERVICE_KEY

function wrap(body) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060c14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0f1c30;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#1A2744 0%,#0f1c30 100%);padding:28px 32px;border-bottom:2px solid #C8102E;">
<span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:1px;">COUNTY <span style="color:#C8102E;">SPORTS</span></span>
<span style="display:block;font-size:11px;color:#aaa;margin-top:4px;text-transform:uppercase;letter-spacing:.08em;">Hourly Activity Digest</span>
</td></tr>
<tr><td style="padding:28px 32px;color:#c8d0dc;font-size:14px;line-height:1.7;">${body}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:#556070;">
Sent automatically when activity occurs &nbsp;·&nbsp; <a href="https://portal.countysports.com/admin.html" style="color:#6496ff;text-decoration:none;">Open Admin</a>
</td></tr>
</table></td></tr></table></body></html>`
}

async function sbGet(path) {
  const res = await fetch(`${SB_URL}${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  try {
    const [submissions, claims, newCreators] = await Promise.all([
      sbGet(`/rest/v1/media_submissions?select=id,status,denial_reason,sport,updated_at&updated_at=gte.${since}`),
      sbGet(`/rest/v1/gigs?select=id,title,status,gig_type,county,claimed_by_name,updated_at&updated_at=gte.${since}&status=neq.open`),
      sbGet(`/rest/v1/collaborator_profiles?select=id,name,created_at&created_at=gte.${since}`),
    ])

    if (!submissions.length && !claims.length && !newCreators.length) {
      return res.status(200).json({ ok: true, sent: false, reason: 'No activity' })
    }

    const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true })
    let sections = `<p style="color:#aaa;font-size:13px;margin:0 0 20px;">Activity in the hour ending <strong style="color:#fff;">${now} ET</strong></p>`

    if (newCreators.length) {
      sections += `<h3 style="color:#4ade80;margin:0 0 8px;font-size:15px;">🆕 New Creators (${newCreators.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
      newCreators.forEach(c => { sections += `<li>${c.name || 'Unnamed'}</li>` })
      sections += `</ul>`
    }

    if (submissions.length) {
      sections += `<h3 style="color:#6496ff;margin:0 0 8px;font-size:15px;">📥 Submission Activity (${submissions.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
      submissions.forEach(s => {
        const label = s.status === 'pending' ? 'New / pending' : s.status === 'approved' ? 'Approved' : `Denied${s.denial_reason ? ' — ' + s.denial_reason : ''}`
        sections += `<li>${label}${s.sport ? ' · ' + s.sport : ''}</li>`
      })
      sections += `</ul>`
    }

    if (claims.length) {
      sections += `<h3 style="color:#facc15;margin:0 0 8px;font-size:15px;">🎯 Gig Activity (${claims.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
      claims.forEach(g => {
        const label = g.status === 'pending_review' ? 'Pending review' : g.status === 'claimed' ? 'Claimed' : g.status === 'completed' ? 'Completed' : g.status
        sections += `<li><strong>${g.title}</strong> — ${label}${g.claimed_by_name ? ' by ' + g.claimed_by_name : ''}${g.county ? ' · ' + g.county + ' Co.' : ''}</li>`
      })
      sections += `</ul>`
    }

    sections += `<p style="margin-top:8px;"><a href="https://portal.countysports.com/admin.html" style="display:inline-block;padding:11px 26px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Open Admin Dashboard</a></p>`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: ADMIN_EMAILS, subject: `County Sports Digest — ${now} ET`, html: wrap(sections) }),
    })

    return res.status(200).json({ ok: true, sent: true })
  } catch (err) {
    console.error('digest error:', err)
    return res.status(500).json({ error: err.message })
  }
}
