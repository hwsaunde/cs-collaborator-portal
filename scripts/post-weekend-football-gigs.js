// post-weekend-football-gigs.js
// 1. Deletes open/unclaimed gigs where sport=Football OR event_type=Scrimmage
// 2. Inserts this weekend's 8 scrimmage/jamboree gigs
// 3. Fires a football_weekend_bulletin email to all creators
//
// Usage: SUPABASE_SERVICE_KEY=xxx node scripts/post-weekend-football-gigs.js

const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_KEY = process.env.SUPABASE_SERVICE_KEY
const NOTIFY_URL = process.env.NOTIFY_URL || 'https://creators.countysports.com/api/notify'

if (!SB_KEY) { console.error('Missing SUPABASE_SERVICE_KEY'); process.exit(1) }

async function sb(path, opts = {}) {
  const res = await fetch(SB_URL + path, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...opts.headers
    }
  })
  return res
}

// ── NEW GIGS ──────────────────────────────────────────────────────────────────

const newGigs = [
  // Friday August 7
  {
    title: 'Cox Mill Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-07',
    county: 'Cabarrus',
    location: 'Cox Mill High School',
    description: 'JV 5:30 PM · Varsity TBD. Teams: Ardrey Kell, Ballantyne Ridge, Sun Valley, Cox Mill.',
  },
  {
    title: 'Mooresville vs. Grimsley',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-07',
    county: 'Guilford',
    location: 'Grimsley High School',
    description: 'Time TBD.',
  },
  {
    title: 'Hough High School Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-07',
    county: 'Mecklenburg',
    location: 'Hough High School',
    description: '6:00 PM — West Cabarrus vs. Palisades\n7:00 PM — Butler vs. West Mecklenburg\n8:00 PM — Mallard Creek vs. Hough',
  },
  {
    title: 'Lake Norman Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-07',
    county: 'Iredell',
    location: 'Lake Norman High School',
    description: 'JV and Varsity. Times TBD. Teams: Cuthbertson, Lake Norman, West Iredell, Northwest Cabarrus.',
  },
  {
    title: 'Seaforth vs. Willow Spring',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-07',
    county: 'Wake',
    location: 'Willow Spring High School',
    description: '9:00 AM kickoff.',
  },
  // Saturday August 8
  {
    title: 'Ashbrook High School Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-08',
    county: 'Gaston',
    location: 'Ashbrook High School',
    description: '6:30 PM — Hunter Huss vs. Bunker Hill\n7:30 PM — Bessemer City vs. Mountain Island Charter\n8:30 PM — Ashbrook vs. James Island (SC)',
  },
  {
    title: 'East Rutherford Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-08',
    county: 'Rutherford',
    location: 'East Rutherford High School',
    description: 'Times TBD. Teams: Enka, Forestview, East Gaston, East Rutherford.',
  },
  {
    title: 'High School OT Jamboree',
    sport: 'Football',
    event_type: 'Scrimmage',
    event_date: '2025-08-08',
    county: 'Wake',
    location: 'WakeMed Soccer Park, Cary',
    description: '5:00 PM — Hunt vs. Union Pines\n6:00 PM — J.H. Rose vs. Rolesville\n8:00 PM — Cardinal Gibbons vs. Millbrook\n9:00 PM — Southern Durham vs. Middle Creek',
  },
]

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {

  // 1. Delete open/unclaimed Football or Scrimmage gigs
  console.log('Deleting open Football/Scrimmage gigs...')
  const delRes = await sb(
    '/rest/v1/gigs?or=(sport.eq.Football,event_type.eq.Scrimmage)&status=in.(open,pending_review)',
    { method: 'DELETE', headers: { Prefer: 'return=representation' } }
  )
  if (!delRes.ok) {
    const err = await delRes.json().catch(() => ({}))
    console.error('Delete failed:', JSON.stringify(err, null, 2))
    process.exit(1)
  }
  const deleted = await delRes.json().catch(() => [])
  console.log(`✓ Deleted ${Array.isArray(deleted) ? deleted.length : '?'} old gigs`)

  // 2. Insert new gigs
  console.log(`Inserting ${newGigs.length} new gigs...`)
  const payload = newGigs.map(g => ({ ...g, gig_type: 'standard', status: 'open' }))
  const insertRes = await sb('/rest/v1/gigs', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  if (!insertRes.ok) {
    const err = await insertRes.json().catch(() => ({}))
    console.error('Insert failed:', JSON.stringify(err, null, 2))
    process.exit(1)
  }
  const inserted = await insertRes.json().catch(() => [])
  console.log(`✓ Inserted ${Array.isArray(inserted) ? inserted.length : newGigs.length} gigs`)

  // 3. Fetch all creator emails
  const profRes = await sb('/rest/v1/collaborator_profiles?select=email&email=not.is.null')
  const profiles = await profRes.json().catch(() => [])
  const emails = (profiles || []).map(p => p.email).filter(Boolean)

  if (!emails.length) {
    console.log('No creator emails found — skipping notification.')
    console.log('Done.')
    return
  }

  // 4. Send football weekend bulletin
  console.log(`Sending football bulletin to ${emails.length} creators...`)
  const notifyRes = await fetch(NOTIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'football_weekend_bulletin',
      payload: { creator_emails: emails, gigs: newGigs }
    })
  })
  if (notifyRes.ok) {
    console.log('✓ Bulletin sent')
  } else {
    console.warn('Notification failed:', await notifyRes.text())
  }

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
