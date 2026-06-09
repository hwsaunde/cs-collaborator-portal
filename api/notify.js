const ADMIN_EMAILS = ['henry@countysports.com', 'erik@countysports.com']
const FROM = 'County Sports <noreply@countysports.com>'

function wrap(body) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#060c14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0f1c30;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#1A2744 0%,#0f1c30 100%);padding:28px 32px;border-bottom:2px solid #C8102E;">
<span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:1px;">COUNTY <span style="color:#C8102E;">SPORTS</span></span>
</td></tr>
<tr><td style="padding:28px 32px;color:#c8d0dc;font-size:14px;line-height:1.7;">${body}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:#556070;">
County Sports Creator Portal &nbsp;·&nbsp; <a href="https://portal.countysports.com" style="color:#6496ff;text-decoration:none;">portal.countysports.com</a>
</td></tr>
</table></td></tr></table></body></html>`
}

async function send(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], subject, html }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Resend error ${res.status}: ${err.message || JSON.stringify(err)}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, payload } = req.body || {}
  if (!type || !payload) return res.status(400).json({ error: 'Missing type or payload' })

  try {
    switch (type) {

      case 'new_submission': {
        const { creator_name, sport, description } = payload
        await send(ADMIN_EMAILS, `New submission from ${creator_name}`, wrap(`
          <h2 style="color:#fff;margin:0 0 12px;font-size:20px;">New Media Submission</h2>
          <p><strong style="color:#fff;">${creator_name}</strong> submitted new media for review.</p>
          ${sport ? `<p><strong style="color:#aaa;">Sport:</strong> ${sport}</p>` : ''}
          ${description ? `<p><strong style="color:#aaa;">Notes:</strong> ${description}</p>` : ''}
          <p style="margin-top:20px;"><a href="https://portal.countysports.com/admin.html" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Review in Admin</a></p>`))
        break
      }

      case 'submission_update': {
        const { creator_email, creator_name, status, denial_reason } = payload
        const approved = status === 'approved'
        await send(creator_email, `Your submission has been ${approved ? 'approved' : 'denied'}`, wrap(`
          <h2 style="color:#fff;margin:0 0 12px;font-size:20px;">Submission ${approved ? 'Approved ✓' : 'Denied'}</h2>
          <p>Hey <strong style="color:#fff;">${creator_name}</strong>,</p>
          <p>Your media submission has been <strong style="color:${approved ? '#4ade80' : '#f87a8a'};">${approved ? 'approved' : 'denied'}</strong>.</p>
          ${!approved && denial_reason ? `<p><strong style="color:#aaa;">Reason:</strong> ${denial_reason}</p>` : ''}
          ${approved ? '<p>It\'s now live on the County Sports platform. Great work!</p>' : '<p>Please review the reason above and feel free to resubmit if applicable.</p>'}
          <p style="margin-top:20px;"><a href="https://portal.countysports.com" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">View Portal</a></p>`))
        break
      }

      case 'gig_posted': {
        const { gig_title, gig_type, event_type, event_date, county, location, description, pay_rate, creator_emails } = payload
        if (!creator_emails?.length) break
        const isPaid = gig_type === 'paid'
        await send(creator_emails, `New Gig: ${gig_title}${county ? ' — ' + county + ' County' : ''}`, wrap(`
          <h2 style="color:#fff;margin:0 0 4px;font-size:22px;text-transform:uppercase;font-family:'Arial Black',Arial,sans-serif;">${gig_title}</h2>
          <p style="margin:0 0 20px;">${isPaid ? '<span style="color:#facc15;font-weight:700;">💰 Paid Gig</span>' : 'New coverage opportunity'} · ${event_type || 'Event'}</p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            ${event_date ? `<tr><td style="color:#aaa;padding:3px 16px 3px 0;font-size:13px;">Date</td><td style="color:#fff;font-size:13px;">${event_date}</td></tr>` : ''}
            ${county ? `<tr><td style="color:#aaa;padding:3px 16px 3px 0;font-size:13px;">County</td><td style="color:#fff;font-size:13px;">${county}</td></tr>` : ''}
            ${location ? `<tr><td style="color:#aaa;padding:3px 16px 3px 0;font-size:13px;">Location</td><td style="color:#fff;font-size:13px;">${location}</td></tr>` : ''}
            ${isPaid && pay_rate ? `<tr><td style="color:#aaa;padding:3px 16px 3px 0;font-size:13px;">Pay Rate</td><td style="color:#facc15;font-size:13px;font-weight:700;">${pay_rate}</td></tr>` : ''}
          </table>
          ${description ? `<p style="background:rgba(255,255,255,0.04);border-left:3px solid #C8102E;padding:10px 14px;border-radius:4px;font-size:13px;">${description}</p>` : ''}
          <p style="margin-top:24px;"><a href="https://portal.countysports.com" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Claim This Gig</a></p>`))
        break
      }

      case 'gig_claimed': {
        const { gig_title, creator_name, county } = payload
        await send(ADMIN_EMAILS, `${creator_name} claimed: ${gig_title}`, wrap(`
          <h2 style="color:#fff;margin:0 0 12px;font-size:20px;">Gig Claimed</h2>
          <p><strong style="color:#fff;">${creator_name}</strong> has claimed the gig <strong style="color:#fff;">${gig_title}</strong>${county ? ' in ' + county + ' County' : ''}.</p>
          <p style="margin-top:20px;"><a href="https://portal.countysports.com/admin.html" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">View Gig Board</a></p>`))
        break
      }

      case 'gig_claim_pending': {
        const { gig_title, creator_name, county, pay_rate } = payload
        await send(ADMIN_EMAILS, `Paid gig claim pending review: ${gig_title}`, wrap(`
          <h2 style="color:#fff;margin:0 0 12px;font-size:20px;">Paid Gig Claim — Review Required</h2>
          <p><strong style="color:#fff;">${creator_name}</strong> has requested to claim the paid gig <strong style="color:#facc15;">${gig_title}</strong>${county ? ' in ' + county + ' County' : ''}.</p>
          ${pay_rate ? `<p><strong style="color:#aaa;">Pay Rate:</strong> <span style="color:#facc15;">${pay_rate}</span></p>` : ''}
          <p>Please review this creator and approve or reject their claim in the admin panel.</p>
          <p style="margin-top:20px;"><a href="https://portal.countysports.com/admin.html" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Review Claim</a></p>`))
        break
      }

      case 'gig_claim_decision': {
        const { creator_email, creator_name, gig_title, approved, rejection_note } = payload
        await send(creator_email, `Paid gig claim ${approved ? 'approved' : 'update'}: ${gig_title}`, wrap(`
          <h2 style="color:#fff;margin:0 0 12px;font-size:20px;">Paid Gig Claim ${approved ? 'Approved ✓' : 'Not Approved'}</h2>
          <p>Hey <strong style="color:#fff;">${creator_name}</strong>,</p>
          <p>Your claim for <strong style="color:#facc15;">${gig_title}</strong> has been <strong style="color:${approved ? '#4ade80' : '#f87a8a'};">${approved ? 'approved' : 'not approved'}</strong>.</p>
          ${!approved && rejection_note ? `<p><strong style="color:#aaa;">Note:</strong> ${rejection_note}</p>` : ''}
          ${approved ? '<p>The gig is yours — check the Gig Board for full details. Good luck out there!</p>' : '<p>Keep an eye on the Gig Board for other opportunities.</p>'}
          <p style="margin-top:20px;"><a href="https://portal.countysports.com" style="display:inline-block;padding:12px 28px;background:#C8102E;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">View Gig Board</a></p>`))
        break
      }

      default:
        return res.status(400).json({ error: 'Unknown notification type' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('notify error:', err)
    return res.status(500).json({ error: err.message })
  }
}
