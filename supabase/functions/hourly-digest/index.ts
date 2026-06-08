import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_EMAILS = ['henry@countysports.com', 'erik@countysports.com']
const FROM = 'County Sports <noreply@countysports.com>'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function wrap(body: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060c14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0f1c30;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#1A2744 0%,#0f1c30 100%);padding:28px 32px;border-bottom:2px solid #C8102E;">
<span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:1px;">COUNTY <span style="color:#C8102E;">SPORTS</span></span>
<span style="display:block;font-size:11px;color:#aaa;margin-top:4px;text-transform:uppercase;letter-spacing:.08em;">Hourly Activity Digest</span>
</td></tr>
<tr><td style="padding:28px 32px;color:#c8d0dc;font-size:14px;line-height:1.7;">${body}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:#556070;">
This digest is sent automatically when activity occurs. &nbsp;·&nbsp; <a href="https://cs-collaborator-portal.vercel.app/admin.html" style="color:#6496ff;text-decoration:none;">Open Admin</a>
</td></tr>
</table></td></tr></table></body></html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  // Fetch last hour's activity in parallel
  const [submissionsRes, claimsRes, newCreatorsRes] = await Promise.all([
    supabase.from('media_submissions').select('id,status,denial_reason,created_at,updated_at,sport,description,user_id').gte('updated_at', since),
    supabase.from('gigs').select('id,title,status,gig_type,county,claimed_by_name,claimed_at,updated_at').gte('updated_at', since).not('status', 'eq', 'open'),
    supabase.from('collaborator_profiles').select('id,name,created_at').gte('created_at', since),
  ])

  const submissions = submissionsRes.data || []
  const claims = claimsRes.data || []
  const newCreators = newCreatorsRes.data || []

  // Only send if there's something to report
  if (!submissions.length && !claims.length && !newCreators.length) {
    return new Response(JSON.stringify({ ok: true, sent: false, reason: 'No activity' }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true })
  let sections = `<p style="color:#aaa;font-size:13px;margin:0 0 20px;">Activity summary for the hour ending <strong style="color:#fff;">${now} ET</strong></p>`

  if (newCreators.length) {
    sections += `<h3 style="color:#4ade80;margin:0 0 8px;font-size:15px;">🆕 New Creators (${newCreators.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
    newCreators.forEach(c => { sections += `<li>${c.name || 'Unnamed'}</li>` })
    sections += `</ul>`
  }

  if (submissions.length) {
    sections += `<h3 style="color:#6496ff;margin:0 0 8px;font-size:15px;">📥 Submission Activity (${submissions.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
    submissions.forEach(s => {
      const label = s.status === 'pending' ? 'New submission' : s.status === 'approved' ? 'Approved' : `Denied${s.denial_reason ? ' — ' + s.denial_reason : ''}`
      sections += `<li>${label}${s.sport ? ' · ' + s.sport : ''}</li>`
    })
    sections += `</ul>`
  }

  if (claims.length) {
    sections += `<h3 style="color:#facc15;margin:0 0 8px;font-size:15px;">🎯 Gig Activity (${claims.length})</h3><ul style="margin:0 0 20px;padding-left:18px;">`
    claims.forEach(g => {
      const label = g.status === 'pending_review' ? `Pending review` : g.status === 'claimed' ? 'Claimed' : g.status === 'completed' ? 'Completed' : g.status
      sections += `<li><strong>${g.title}</strong> — ${label}${g.claimed_by_name ? ' by ' + g.claimed_by_name : ''}${g.county ? ' · ' + g.county + ' Co.' : ''}</li>`
    })
    sections += `</ul>`
  }

  sections += `<p style="margin-top:8px;"><a href="https://cs-collaborator-portal.vercel.app/admin.html" style="display:inline-block;padding:11px 26px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Open Admin Dashboard</a></p>`

  const html = wrap(sections)

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: ADMIN_EMAILS, subject: `County Sports Digest — ${now} ET`, html }),
  })

  return new Response(JSON.stringify({ ok: true, sent: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
