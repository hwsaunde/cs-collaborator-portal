// seed-gigs.js — inserts all 94 preseason gigs + fires bulk notification
// Usage: SUPABASE_SERVICE_KEY=xxx node scripts/seed-gigs.js

const SB_URL = 'https://alvcxrsxkicjdktzcbee.supabase.co'
const SB_KEY = process.env.SUPABASE_SERVICE_KEY
const NOTIFY_URL = process.env.NOTIFY_URL || 'https://creators.countysports.com/api/notify'

if (!SB_KEY) { console.error('Missing SUPABASE_SERVICE_KEY'); process.exit(1) }

const gigs = [

  // ── FOOTBALL ─────────────────────────────────────────────────────────────

  {
    title: 'Brody Lowe — Freshman QB at Grimsley',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Grimsley High School — Greensboro, NC',
    description: 'Class of 2029 — Rising Sophomore. 2025 Stats: 2,241 pass yds · 23 TDs · 148 passer rating as a freshman. Story: The heir to Faizon Brandon\'s throne at the defending 7A state champions. Highest passer rating of any returning QB in NC. Plant your flag on this player now. Coverage: Practice Day + Player Spotlight. NOTE: One trip to Grimsley also covers Elizabeth Gray (top 7A setter) and Allison Mulry (376 kills) for volleyball.'
  },
  {
    title: 'Ethan Royal — New Starter at 8A Champions Hough',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Mecklenburg',
    location: 'Hough High School — Cornelius, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 2,272 pass yds · 29 TDs · 111 passer rating. Story: Steps into the starting role at 8A champion Hough (14-0). First full season as the starter at the biggest program in 8A. Massive opportunity story. Coverage: Practice Day + Coach Interview.'
  },
  {
    title: 'Zak Ishman — #1 Returning QB in NC',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Bertie',
    location: 'Northeastern High School — Bertie County, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 3,233 pass yds · 36 TDs · 130 passer rating — highest passing total of any returning eligible QB statewide. Story: Best statistical QB returning in all of NC. Eastern NC story that\'s severely undercovered. Northeastern is in Bertie County — a region that rarely gets exposure. Coverage: Player Spotlight + Practice Coverage.'
  },
  {
    title: 'Teo McPhatter — The Hidden Gem RB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Johnston',
    location: 'Princeton High School — Princeton, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 2,457 rush yds · 36 TDs · 204.8 yds/game as a sophomore at a 3A school. Story: The most underrated player in the state. 2,457 yards and 36 touchdowns as a sophomore. No one outside Johnston County is talking about him. That changes now. Coverage: Player Spotlight.'
  },
  {
    title: 'Quinton Cypher + Rashad Streets — Millbrook Defensive Duo',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Millbrook High School — Raleigh, NC',
    description: 'Both Class of 2027 — Rising Seniors. 2025 Stats: Cypher — 181 tackles, 48 TFL, Ohio State commit. Streets — 15 sacks, 43 hurries, Oregon commit. Story: Two of the top five defenders in NC on the same team. Ohio State + Oregon commits in the same linebacker/edge group. SWEEP: One trip to Millbrook also covers Bryson Gray (QB, 2,518 yds, 24 TDs). Coverage: Multi-Player Practice Sweep.'
  },
  {
    title: 'Jamel Perry — Top Returning Scorer in NC',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Knightdale High School — Knightdale, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 222 points scored · 37 TDs — most points by any returning eligible player in NC. Also: 2,694 pass yds · 28 TDs as a dual-threat QB. Story: 37 touchdowns and 222 points. No eligible returning player in the state scored more. Dual-threat story in Wake County, easy creator access. Coverage: Player Spotlight.'
  },
  {
    title: 'Devin Cotton — #1 Pass Rusher in NC',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Dudley High School — Greensboro, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 21 sacks · 16 hurries · 153 yards lost — most sacks of any returning eligible player statewide. Story: The most dominant pass rusher returning in all of NC. Nationally recruited edge rusher. Dudley is a historically great program. Greensboro creators are well-positioned. Coverage: Player Spotlight + Practice Coverage.'
  },
  {
    title: 'Rashad Lynch + Jalaythan Mayfield — Lincolnton Double',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Lincoln',
    location: 'Lincolnton High School — Lincolnton, NC',
    description: 'Both Class of 2027 — Rising Seniors. 2025 Stats: Lynch — 2,699 pass yds + 1,116 rush yds (true dual-threat). Mayfield — 152 tackles, 26 TFL, 6 sacks. Story: Two of the top returning players in 3A on the same team. SWEEP: One trip to Lincoln County also covers Jaxon Dollar (TE, East Lincoln), RJ Lynch (WR, Lincolnton), Edwin Ramirez (soccer, West Lincoln), and Cameron Kupsco (GK, North Lincoln). Coverage: Practice Day + Multi-Player Sweep.'
  },
  {
    title: 'Jailen Smith — 201 Tackles, Thomasville',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Davidson',
    location: 'Thomasville High School — Thomasville, NC',
    description: 'Class of 2027 — Rising Senior. Position: MLB/DE. 2025 Stats: 201 total tackles · 26 TFL · 10 sacks. Story: 201 tackles in a season — that number alone is the headline. Davidson County is underserved and this player deserves a spotlight. NOTE: One trip to Davidson County also covers Grayson Treadway (Oak Grove QB, 32 TDs). Coverage: Player Spotlight.'
  },
  {
    title: 'Parker Willis — Top Sophomore RB, North Henderson',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Henderson',
    location: 'North Henderson High School — Hendersonville, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 2,148 rush yds · 24 TDs · 195.3 yds/game. Story: Second-best rushing average per game of any returning player in NC. Western NC is underserved. Henderson County story with real upside. NOTE: One trip to Henderson County also covers JaRon Ward (Hendersonville QB, 134 rating). Coverage: Player Spotlight.'
  },
  {
    title: 'John Evans Jr. — Reagan RB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'Reagan High School — Pfafftown, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 2,074 rush yds · 26 TDs · 172.8 yds/game. Story: Top returning back in 7A. Reagan is a consistently deep playoff program. Forsyth County creators have natural access. NOTE: One trip to Reagan also covers Elly Randolph (volleyball, 641 kills — #1 in NC). Coverage: Practice Day + Player Spotlight.'
  },
  {
    title: 'Jaxon Dollar — National TE Prospect, East Lincoln',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Lincoln',
    location: 'East Lincoln High School — Denver, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,190 rec yds · 20 TDs. Also ranked Top-5 nationally at TE position (Rivals). Story: Top-5 tight end in the country playing at a small-market school in Lincoln County. The contrast of a national-level prospect at an under-the-radar school makes for a compelling feature. SWEEP: Lincoln County trip also covers Cameron Kupsco (GK) and Edwin Ramirez (soccer). Coverage: Player Spotlight + Interview.'
  },
  {
    title: 'Tristan Thompson-Wynn — #1 Returning WR in NC',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Transylvania',
    location: 'Brevard High School — Brevard, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,450 rec yds · 20 TDs — most receiving yards of any returning eligible player statewide. Story: Led ALL returning eligible receivers in NC in yardage. Mountain school in Transylvania County. Underserved region, elite player. A creator road trip worth making. Coverage: Player Spotlight.'
  },
  {
    title: 'Jaleek Parson — J.H. Rose WR',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Pitt',
    location: 'J.H. Rose High School — Greenville, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 1,218 rec yds · 12 TDs · 101.5 yds/game. Story: Top returning WR in Eastern NC at the same school as the 6A volleyball state champions. SWEEP: One creator visit to J.H. Rose covers two major sports stories — football and volleyball. Coverage: Player Spotlight.'
  },
  {
    title: 'Hough Football — Defending 8A State Champions',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Mecklenburg',
    location: 'Hough High School — Cornelius, NC',
    description: 'Team coverage. 2025 Season: 14-0 · 8A State Champions (first year in 8A classification). Story: The biggest program in 8A entering 2026. New starting QB Ethan Royal, defending title, all eyes on Hough. Mecklenburg County creators should make this their first stop July 29. Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Grimsley Football — Defending 7A State Champions',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Grimsley High School — Greensboro, NC',
    description: 'Team coverage. 2025 Season: Back-to-back 7A state champions. Home of Brody Lowe (Class 2029, 148 passer rating as a freshman). Story: Dynasty program with the next great QB already in the building. Can they three-peat? SWEEP: Greensboro creators can cover Grimsley football + Allison Mulry + Elizabeth Gray (volleyball) in one visit. Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Watauga Football — Perfect Season 6A Champions',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Watauga',
    location: 'Watauga High School — Boone, NC',
    description: 'Team coverage. 2025 Season: 15-0 · 6A State Champions · First title in program history. Story: A perfect season and a first-ever title in the mountains of NC. SWEEP: Watauga also reached the 6A volleyball final — one creator trip covers football team + Lainey Gragg (setter, 1,076 assists) + Caroline Childers (libero, 546 digs). Coverage: Team Practice Day Coverage + Coach Interview.'
  },
  {
    title: 'Tarboro Football — 2A Dynasty',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Edgecombe',
    location: 'Tarboro High School — Tarboro, NC',
    description: 'Team coverage. 2025 Season: 2A State Champions. One of the most decorated small-school football programs in NC history. Story: Multiple state titles across multiple decades. Eastern NC pride. A visit to Tarboro during preseason is a visit to a program that defines winning culture at the 2A level. Coverage: Team Practice Day Coverage + Coach Interview.'
  },

  // New QBs
  {
    title: 'Michael Alford — North Rowan QB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Rowan',
    location: 'North Rowan High School — Spencer, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 2,865 pass yds · 28 TDs · 129 passer rating — #2 returning QB in NC by yardage. Story: One of the most productive returning QBs in the state at a program with serious playoff pedigree. Rowan County is accessible from both Charlotte and the Triad. Coverage: Player Spotlight + Practice Coverage.'
  },
  {
    title: 'Aury Greenfield — Jay M. Robinson QB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Cabarrus',
    location: 'Jay M. Robinson High School — Concord, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 2,574 pass yds · 26 TDs · 133 passer rating — one of the highest efficiency ratings of any returning QB in NC. Story: Elite passer efficiency in a high-output offense. Cabarrus County is in the heart of the Charlotte metro and easy access for creators. Coverage: Player Spotlight.'
  },
  {
    title: 'Grayson Treadway — Oak Grove QB, 32 TDs',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Davidson',
    location: 'Oak Grove High School — Advance, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 2,499 pass yds · 32 TDs · 126 passer rating. Story: 32 touchdowns is elite production for any classification. Davidson County is underserved — a Triad-area creator who shows up here first builds real credibility. NOTE: One trip to Davidson County also covers Jailen Smith (201 tackles, Thomasville). Coverage: Player Spotlight.'
  },
  {
    title: 'JaRon Ward — Hendersonville QB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Henderson',
    location: 'Hendersonville High School — Hendersonville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 2,390 pass yds · 29 TDs · 134 passer rating — highest efficiency rating of any returning QB in NC. Story: The most efficient returning passer in the state by rating. Western NC story. Henderson County is accessible from Asheville. NOTE: One trip covers both Ward and Parker Willis (North Henderson RB, 195.3 yds/game). Coverage: Player Spotlight.'
  },
  {
    title: 'Reginald Gray — Northside-Jacksonville QB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Onslow',
    location: 'Northside-Jacksonville High School — Jacksonville, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 2,629 pass yds · 26 TDs · 96 passer rating. Story: Top returning Class of 2028 QB in NC by passing yards. Jacksonville/Onslow County is a military-connected community that\'s chronically underserved in media coverage. A creator who shows up here first plants a flag in an entire region. NOTE: One trip to Onslow County also covers Amari Pearson (RB) and Phoenix Villanueva (soccer GK). Coverage: Player Spotlight.'
  },
  {
    title: 'Tyler Jackson — SE Alamance QB',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Southeast Alamance High School — Burlington, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 2,579 pass yds · 24 TDs · 115 passer rating. Story: Rising junior with big production already on the board. Alamance County has multiple County Sports gig targets across football and soccer — a creator based in the Burlington/Greensboro corridor can run a full county sweep. Coverage: Player Spotlight.'
  },

  // New RBs
  {
    title: 'Amari Pearson — Jacksonville RB, 1,935 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Onslow',
    location: 'Jacksonville High School — Jacksonville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,935 rush yds · 30 TDs · 148.8 yds/game. Story: Top returning RB in Eastern NC outside of the Teo McPhatter conversation. Jacksonville/Onslow County is underserved — a creator making this trip is first to this market. NOTE: One trip to Onslow County also covers Reginald Gray (QB) and Phoenix Villanueva (soccer GK, Swansboro). Coverage: Player Spotlight.'
  },
  {
    title: 'Garrett Young — Franklin RB, Western NC',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Macon',
    location: 'Franklin High School — Franklin, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 1,789 rush yds · 23 TDs · 149.1 yds/game. Story: Top returning RB in Western NC outside the Hendersonville market. Macon County is one of the most underserved counties on this entire list — a creator willing to make the drive to Franklin would be doing work nobody else is doing. Coverage: Player Spotlight.'
  },
  {
    title: 'Cameron Clem — Murphy RB, 1,723 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Cherokee',
    location: 'Murphy High School — Murphy, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,723 rush yds · 30 TDs · 143.6 yds/game. Story: 30 touchdowns at the westernmost 4A school in NC. Murphy/Cherokee County is as far west as it gets in NC high school football — deeply underserved and hungry for coverage. Coverage: Player Spotlight.'
  },
  {
    title: 'Jaheem Jenkins — Hickory RB, 36 TDs',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Catawba',
    location: 'Hickory High School — Hickory, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,695 rush yds · 36 TDs · 121.1 yds/game. Story: 36 touchdowns ties for the most of any returning RB in NC. Hickory is a strong sports market in Catawba County. NOTE: One trip to Hickory also covers Emmi Gambill (volleyball, 597 kills, 5A state champion). Coverage: Player Spotlight.'
  },
  {
    title: 'Micah Olu — Wake Forest RB, 1,643 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Wake Forest High School — Wake Forest, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,643 rush yds · 24 TDs · 136.9 yds/game. Story: Top returning RB in Wake County. Wake Forest is a fast-growing suburb with a strong athletic program. Easy access for Triangle-area creators. Coverage: Player Spotlight.'
  },
  {
    title: 'Myles Eatmon — Northern Nash RB, 1,635 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Nash',
    location: 'Northern Nash High School — Red Oak, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,635 rush yds · 25 TDs · 125.8 yds/game. Story: Top returning RB in Nash County. Northern Nash is a consistent football program in a region that doesn\'t get much coverage. A creator coming to Nash County would also find Hannah Battle (volleyball, 130 blocks, Rocky Mount). Coverage: Player Spotlight.'
  },

  // New WRs
  {
    title: 'Ryder McClure — Bandys WR, 1,167 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Catawba',
    location: 'Bandys High School — Catawba, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,167 rec yds · 18 TDs · 97.2 yds/game. Story: Top returning WR in Catawba County at a smaller school that rarely gets media attention. Catawba County has multiple coverage targets in football and volleyball — strong sweep potential for a creator based in that area. Coverage: Player Spotlight.'
  },
  {
    title: 'Braylon Clark — Charlotte Country Day WR',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Mecklenburg',
    location: 'Charlotte Country Day School — Charlotte, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 1,093 rec yds · 12 TDs · 109.3 yds/game — top yds/game average among returning WRs in Mecklenburg County. Story: Elite production at a private school in Charlotte. Charlotte-area creators have direct access to one of the most productive young receivers in the Mecklenburg market. Coverage: Player Spotlight.'
  },
  {
    title: 'Immanuel Collins — Shelby WR, 1,086 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Cleveland',
    location: 'Shelby High School — Shelby, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,086 rec yds · 13 TDs · 72.4 yds/game. Story: Top returning pass catcher in Cleveland County at Shelby — a program that scored 84 points in the 3A state championship game in 2025 (NC record). Collins is part of one of the most explosive offenses in the state. Coverage: Player Spotlight.'
  },
  {
    title: 'Jamaal Epps — Franklinton WR, 1,012 yds',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Franklin',
    location: 'Franklinton High School — Franklinton, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,012 rec yds · 10 TDs · 84.3 yds/game. Story: Top returning receiver in Franklin County. Franklinton is north of Raleigh — easy Triangle-area access. A 1,000-yard receiver in a county that rarely sees coverage. Coverage: Player Spotlight.'
  },

  // New Defense
  {
    title: 'Judah Harris + CJ Dickerson — Hunt School Defensive Duo',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Wilson',
    location: 'Hunt High School — Wilson, NC',
    description: 'Both Class of 2027 — Rising Seniors. 2025 Stats: Harris — 191 tackles, 50 TFL, ILB. Dickerson — 180 tackles, 46 TFL, 15 sacks, DT. Story: Two of the top five defenders in NC on the same team — 371 combined tackles between them. Hunt is an elite defensive program in Wilson County. Eastern NC access. Coverage: Multi-Player Practice Sweep.'
  },
  {
    title: 'Kadence Pruitt — Reidsville DE, 65 Hurries',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Rockingham',
    location: 'Reidsville High School — Reidsville, NC',
    description: 'Class of 2027 — Rising Senior. Position: DE. 2025 Stats: 12.5 sacks · 65 hurries — most QB hurries of any returning pass rusher in NC. Reidsville is the defending 4A state champion. Story: The most disruptive pass rusher returning in NC by pressure numbers, playing for the defending 4A champions. Rockingham County is a short drive from Greensboro. Coverage: Player Spotlight + Practice Coverage.'
  },
  {
    title: 'Malik Jones — Sallie B. Howard, 11 INTs',
    sport: 'Football', event_type: 'Practice / Feature', county: 'Bertie',
    location: 'Sallie B. Howard School — Wilson, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 11 interceptions — most of any returning eligible player in NC. Story: 11 picks is a staggering number at any level. Sallie B. Howard is a small private school — the ball hawk story here has major viral potential. Bertie County is in Eastern NC and underserved. Coverage: Player Spotlight.'
  },

  // ── VOLLEYBALL ──────────────────────────────────────────────────────────

  {
    title: 'Elly Randolph — #1 Kill Leader in NC',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'Reagan High School — Pfafftown, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 641 kills · 6.2 kills/set — most kills of any returning eligible player statewide. Story: The most prolific hitter returning in all of NC. Reagan went 26-10 and made a deep playoff run. NOTE: One trip to Reagan also covers John Evans Jr. (football RB, 2,074 yds). Coverage: Player Spotlight + Practice Coverage.'
  },
  {
    title: 'Emmi Gambill — 5A State Champion Hitter, Hickory',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Catawba',
    location: 'Hickory High School — Hickory, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 597 kills · 5.1 K/set · on the 5A State Championship team. Story: Top hitter on a state championship program. Hickory won 5A — returning the core of that team. NOTE: One trip to Hickory also covers Jaheem Jenkins (football RB, 36 TDs) and Ryder McClure (WR, Bandys). Coverage: Player Spotlight.'
  },
  {
    title: 'Joscelyn Stamper — Cherokee Nation Star',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Cherokee',
    location: 'Cherokee High School — Cherokee, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 485 kills · 4.6 K/set · 50.2% hitting efficiency — top hitter in 2A. Story: Top hitter in 2A, representing the Eastern Band of Cherokee Indians. A unique cultural and athletic story that has national appeal. One of the most compelling subjects on this entire list. Coverage: Player Spotlight + Feature Interview.'
  },
  {
    title: 'Lainey Gragg — #1 Setter in NC',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Watauga',
    location: 'Watauga High School — Boone, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 1,076 assists · 11.3 assists/set — most assists of any returning setter statewide. Story: The best setter returning in NC by a significant margin. Ran the offense for Watauga\'s run to the 6A volleyball final. SWEEP: Watauga also won the football 6A title — one trip covers football team + Gragg + Caroline Childers (libero, 546 digs). Coverage: Player Spotlight.'
  },
  {
    title: 'Riley Caruso — Setter for 4A State Champs, Lake Norman Charter',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Iredell',
    location: 'Lake Norman Charter School — Mooresville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 911 assists · 8.4 A/set — starting setter for the 4A State Championship team. Story: The engine behind Lake Norman Charter\'s 4A title. Defending champions with the setter returning. NOTE: Iredell County also has Maya Forrai (Lake Norman libero) and Kelsey Fliss (Mooresville blocker). Coverage: Player Spotlight.'
  },
  {
    title: 'Victoria Simons — Marvin Ridge OH',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Union',
    location: 'Marvin Ridge High School — Waxhaw, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 362 kills · 3.7 K/set · 53.9% hitting efficiency — on the 7A State Championship team. Story: Played on the team that won BOTH volleyball (7A) AND boys soccer (7A) state titles. The dual-sport dynasty story at Marvin Ridge is the most important team narrative in NC sports in 2026. SWEEP: One trip to Marvin Ridge covers volleyball + soccer team stories + Keven Lopez-Ramirez (soccer). Coverage: Player Spotlight + Team Feature.'
  },
  {
    title: 'Elizabeth Gray — Top 7A Setter, Grimsley',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Grimsley High School — Greensboro, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 898 assists · 10.2 A/set — top returning setter in 7A. Story: Top returning setter in 7A at a school that also won the football state title. SWEEP: Grimsley is a one-stop shop — Brody Lowe (QB), Allison Mulry (kills), and Elizabeth Gray (setter) are all at the same school. Coverage: Player Spotlight.'
  },
  {
    title: 'Naomi Stevenson — Freshman Sensation, Seaforth',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Chatham',
    location: 'Seaforth High School — Pittsboro, NC',
    description: 'Class of 2029 — Rising Sophomore. 2025 Stats: 419 kills · 4.3 K/set · 47.9% hitting efficiency — as a FRESHMAN. Story: 419 kills as a freshman at the 5A state finalist Seaforth. She is a rising sophomore entering her second year as a starter. One of the best young hitters in NC. Get on her early. Coverage: Player Spotlight.'
  },
  {
    title: 'Amanda McLean — #1 Blocker in NC, East Burke',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Burke',
    location: 'East Burke High School — Icard, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 146 total blocks · 1.8 blocks/set — most blocks of any returning eligible player statewide. Story: Top returning blocker in all of NC. East Burke is a mid-size mountain program in an underserved county. Strong \'who knew\' angle for a player who dominated at the net. Coverage: Player Spotlight.'
  },
  {
    title: 'Rory Boyle — 2A Championship MVP',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Davidson',
    location: 'Community School of Davidson — Davidson, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 120 total blocks · 1.2 B/set · Named 2A Championship MVP. Story: Was named MVP of the 2A state championship. Community School of Davidson is a consistent powerhouse in the small-school division. Triad-area access is easy. Coverage: Player Spotlight + Interview.'
  },
  {
    title: 'Green Level Volleyball — Undefeated 8A Champions',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Green Level High School — Cary, NC',
    description: 'Team coverage. 2025 Season: 28-0 · Perfect season · 8A State Champions. Story: Won 8A volleyball without a single loss. 28-0 is remarkable at any level. Defending title with the bulk of the roster returning including setter Scarlett Taylor (727 assists). The program to beat in 8A. Triangle area access. Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Marvin Ridge Volleyball — Defending 7A Champions',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Union',
    location: 'Marvin Ridge High School — Waxhaw, NC',
    description: 'Team coverage. 2025 Season: 32-2 · 7A State Champions. Also won 7A boys soccer title. Story: The dual-sport dynasty. One school won the 7A volleyball AND 7A soccer title in the same year. This is the biggest team story in NC going into fall 2026. Charlotte-area creators must cover this. Coverage: Team Feature + Dual-Sport Story.'
  },
  {
    title: 'D.H. Conley — 7A Runner-Up, 26-3',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Pitt',
    location: 'D.H. Conley High School — Greenville, NC',
    description: 'Team coverage. 2025 Season: 26-3 · Conference Champions · 7A State Runner-Up. Story: Best program in Eastern NC volleyball. Came within one match of the state title. With most of the roster returning, they are the clear 7A contender for 2026. NOTE: Greenville-area creators can also cover David Valdez (North Pitt soccer). Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Watauga Volleyball — 6A Finalist',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Watauga',
    location: 'Watauga High School — Boone, NC',
    description: 'Team coverage. 2025 Season: 27-2 · Conference Champions · 6A State Finalist. School also won the 6A football title. Story: Watauga made the state finals in BOTH football and volleyball in the same school year. SWEEP: One trip to Watauga covers football team (15-0 champs) + Lainey Gragg (setter) + Caroline Childers (libero) + this team feature. Coverage: Team Feature + Cross-Sport Story.'
  },

  // New kill leaders
  {
    title: 'Emmy Talbert — North Stanly, 523 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Stanly',
    location: 'North Stanly High School — New London, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 523 kills · 5.3 K/set — #3 returning kill leader in NC. Story: One of the highest kill totals in the state from a Class 2028 player. North Stanly is in Stanly County — a market that rarely sees sports media coverage. A creator making this trip would be breaking new ground. Coverage: Player Spotlight.'
  },
  {
    title: 'Olivia Easton — South Point, 432 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Gaston',
    location: 'South Point High School — Belmont, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 432 kills · 4.9 K/set. Story: Top returning hitter in Gaston County. South Point is a strong 5A program in the Charlotte metro orbit. Charlotte-area and Belmont creators have easy access. Coverage: Player Spotlight.'
  },
  {
    title: 'Nejari Crooks — Wesleyan Christian Academy, 6.5 K/Set',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'Wesleyan Christian Academy — High Point, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 405 kills · 6.5 kills/set — highest kills-per-set rate of any returning player in NC. Story: The most efficient hitter returning in the state. Private school in the Triad with elite production that nobody is covering. Forsyth/Guilford creators have direct access. NOTE: One trip to this area also covers Elly Randolph (Reagan) and Hadley Lichty (West Forsyth). Coverage: Player Spotlight.'
  },
  {
    title: 'Madeline Adair — Union Pines, 399 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Moore',
    location: 'Union Pines High School — Cameron, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 399 kills · 4.5 K/set. Story: Top returning hitter in Moore County. Union Pines is in the Sandhills region — an area between the Triangle and the coast that rarely gets sports coverage. A creator showing up in Moore County is doing first-in-market work. Coverage: Player Spotlight.'
  },
  {
    title: 'Jane Young — East Mecklenburg, 397 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Mecklenburg',
    location: 'East Mecklenburg High School — Charlotte, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 397 kills · 3.7 K/set — top returning hitter in 8A Mecklenburg. Story: Rising junior with two more years of eligibility at a major Charlotte-area program. Charlotte creators have direct access and this player has long-term story potential. Coverage: Player Spotlight.'
  },
  {
    title: 'Reese Walker — Western Alamance, 392 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Western Alamance High School — Burlington, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 392 kills · 5.1 K/set. Story: Top returning hitter in Alamance County at the same school as soccer state champions Grant Bacchus and Elio Anguiano. SWEEP: Western Alamance is a one-stop multi-sport location — volleyball kills + soccer team + two soccer player spotlights in one visit. Coverage: Player Spotlight.'
  },
  {
    title: 'Allison Mulry — Grimsley, 376 Kills',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Grimsley High School — Greensboro, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 376 kills · 4.2 K/set. Story: Top returning hitter at Grimsley — the defending 7A football state champions. SWEEP: One trip to Grimsley covers Brody Lowe (QB, football), Allison Mulry (kills, volleyball), and Elizabeth Gray (setter, volleyball). Three stories in one school visit. Coverage: Player Spotlight.'
  },

  // New setters
  {
    title: 'Scarlett Taylor — Green Level Setter, 727 Assists',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Green Level High School — Cary, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 727 assists · 9.0 A/set on the 28-0 8A State Championship team. Story: The setter who ran the offense for the only undefeated volleyball team in NC. Rising junior — two more years of eligibility. Triangle-area access. NOTE: One trip to Green Level covers both the team practice day gig and this player spotlight. Coverage: Player Spotlight.'
  },
  {
    title: 'Rylee Hedrick — Carson Setter, 931 Assists',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Rowan',
    location: 'Carson High School — Concord, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 931 assists · 9.8 A/set — #2 returning setter in NC by assists. Story: One of the most productive setters in the state at a program with consistent playoff history. Rowan County is in the Cabarrus/Concord area — accessible from both Charlotte and the Triad. NOTE: One trip to Rowan County also covers Michael Alford (North Rowan QB). Coverage: Player Spotlight.'
  },
  {
    title: 'Chloe Burbage — Green Hope Setter, 10.0 A/Set',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Wake',
    location: 'Green Hope High School — Cary, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 781 assists · 10.0 A/set — elite set distribution rate in 8A. Story: One of the most efficient setters in Wake County. Green Hope is a consistent 8A program in Cary. Triangle-area creators have direct access. Coverage: Player Spotlight.'
  },
  {
    title: 'Hadley Lichty — West Forsyth Setter, 8A Finalist',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'West Forsyth High School — Clemmons, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 774 assists · 7.5 A/set — starting setter for the 8A state finalist (23-5 overall). Story: West Forsyth made the 8A volleyball final in 2025 and is the prime challenger to Green Level in 2026. Triad-area access. NOTE: West Forsyth also reached the 8A soccer final — multi-sport program story. Coverage: Player Spotlight.'
  },

  // New liberos
  {
    title: 'Caroline Childers — Watauga Libero, 546 Digs',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Watauga',
    location: 'Watauga High School — Boone, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 546 digs · 5.7 digs/set — #1 returning libero in NC by dig total. Story: The defensive anchor of the team that went to the 6A volleyball state final. SWEEP: Watauga is the highest-value multi-gig location on the entire list — football team (15-0 champs) + Lainey Gragg (setter) + Childers (libero) all in one visit. Coverage: Player Spotlight.'
  },
  {
    title: 'Maya Forrai — Lake Norman Libero, 504 Digs',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Iredell',
    location: 'Lake Norman High School — Mooresville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 504 digs · 5.7 digs/set — #2 returning libero in NC by dig total. Story: Elite defensive presence in Iredell County. SWEEP: One trip to the Lake Norman area covers Maya Forrai (libero, Lake Norman), Riley Caruso (setter, Lake Norman Charter), and Kelsey Fliss (blocker, Mooresville) — three volleyball gigs in the same corridor. Coverage: Player Spotlight.'
  },

  // New blockers
  {
    title: 'Kelsey Fliss — Mooresville, Class of 2029 Blocker',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Iredell',
    location: 'Mooresville High School — Mooresville, NC',
    description: 'Class of 2029 — Rising Sophomore. 2025 Stats: 140 total blocks · 1.5 B/set — as a FRESHMAN. Story: 140 blocks as a freshman is exceptional. Get ahead of this player now — she has three more years of eligibility and is already one of the best blockers in 7A. Iredell County access is easy from Charlotte. Coverage: Player Spotlight.'
  },
  {
    title: 'Hannah Battle — Rocky Mount Blocker, 130 Blocks',
    sport: 'Volleyball', event_type: 'Practice / Feature', county: 'Nash',
    location: 'Rocky Mount High School — Rocky Mount, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 130 total blocks · 1.9 blocks/set — third-highest block rate among returning players in NC. Story: Elite blocker in Eastern NC at Rocky Mount — a major athletic program in Nash County. NOTE: One trip to Nash County also covers Myles Eatmon (Northern Nash RB). Coverage: Player Spotlight.'
  },

  // ── MEN'S SOCCER ────────────────────────────────────────────────────────

  {
    title: 'Grant Bacchus — State Champ Scoring Leader, Western Alamance',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Western Alamance High School — Burlington, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 45 goals · 16 assists · 106 points in 29 games — leading scorer for the 5A State Championship team. Story: Rising junior with two years of eligibility left. SWEEP: Western Alamance is a multi-sport sweep — soccer team (5A champs) + Grant Bacchus + Elio Anguiano + Reese Walker (volleyball kills) all in one visit. Coverage: Player Spotlight.'
  },
  {
    title: 'Ishaq Algozy — The Complete Player, East Bladen',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Bladen',
    location: 'East Bladen High School — Elizabethtown, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 33 goals · 31 assists · 97 points — most well-rounded scoring profile of any returning player in NC. Story: 33 goals AND 31 assists. Nobody else in NC comes close to that combination. Bladen County is one of the most underserved counties in the state. This is a must-cover. Coverage: Player Spotlight + Feature.'
  },
  {
    title: 'Eduardo Murillo-Ramirez — 73 Goals, The Oakwood School',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: null,
    location: 'The Oakwood School — Private',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 73 goals · 17 assists · 163 points in 24 games · 3.04 goals/game — statewide leader by massive margin. Story: 73 goals in 24 games. Nobody else is within 28 goals. The best individual scoring season in NC boys soccer this decade. Private school, but the performance is nationally significant. Coverage: Player Spotlight.'
  },
  {
    title: 'Owen Justice — Top Public School Striker, Ragsdale',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Guilford',
    location: 'Ragsdale High School — Jamestown, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 43 goals · 17 assists · 103 points in 22 games. Story: Top goal scorer among returning public school NCHSAA players. Greensboro market with strong creator access. Ragsdale is a historically relevant program in the Metro conference. Coverage: Player Spotlight.'
  },
  {
    title: 'Noah Teabout — 100 Points as a Sophomore, SE Alamance',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Southeast Alamance High School — Burlington, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 43 goals · 14 assists · 100 points in 25 games — as a sophomore. Story: 100 points as a sophomore. Rising junior. Alamance County is close to both Burlington and Greensboro creators. Coverage: Player Spotlight.'
  },
  {
    title: 'Spencer Goodwin — Top Scorer in Eastern NC, New Bern',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Craven',
    location: 'New Bern High School — New Bern, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 40 goals · 15 assists · 95 points in 21 games. Story: The best returning public school scorer in Eastern NC. New Bern is a strong coastal market. Greenville/New Bern creator territory. Coverage: Player Spotlight.'
  },
  {
    title: 'Elmer Mejia-Turcios — Vance County Striker',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Vance',
    location: 'Vance County High School — Henderson, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 45 goals · 9 assists · 99 points · 1.96 goals/game. Story: Second-highest goal total among returning public school players. Vance County is underserved — an area code 252 school that\'s flying under the radar. A creator making this trip would be first. Coverage: Player Spotlight.'
  },
  {
    title: 'Kevin Pulido — Class of 2029 Freshman Standout, Montgomery Central',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Montgomery',
    location: 'Montgomery Central High School — Troy, NC',
    description: 'Class of 2029 — Rising Sophomore. 2025 Stats: 27 goals · 23 assists · 77 points — as a FRESHMAN. Story: 27 goals and 23 assists as a freshman. Rising sophomore. Track this player now. Montgomery County is extremely underserved and this is exactly the kind of early find that builds County Sports credibility. Coverage: Player Spotlight.'
  },
  {
    title: 'Angel Contreras — #1 Returning Assist Leader, Greene Central',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Greene',
    location: 'Greene Central High School — Snow Hill, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 33 assists · 1.50 assists/game — most assists of any returning eligible player statewide. Story: Led all returning NC players in assists. Greene County is Eastern NC, close to Greenville creators. The assist-first playmaker story is a great counter to all the goal-scorer features. Coverage: Player Spotlight.'
  },
  {
    title: 'Jaheem Blount — #1 Returning GK in NC, Southside',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Person',
    location: 'Southside High School — Roxboro, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 429 saves — most saves of any returning eligible goalkeeper statewide. Story: 429 saves. The busiest and most active returning goalkeeper in NC. Person County (Roxboro area) is deeply underserved. A creator visit to Southside would be groundbreaking coverage for that community. Coverage: Player Spotlight + GK Feature.'
  },
  {
    title: 'Cameron Kupsco — Elite GK, North Lincoln',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Lincoln',
    location: 'North Lincoln High School — Denver, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 285 saves · 1.77 GAA in 26 games. Story: Elite goals-against average over a full 26-game season. SWEEP: Lincoln County already has a presence via football (Jaxon Dollar, Rashad Lynch) — one creator sweep through the county covers football + soccer in one visit. Coverage: Player Spotlight.'
  },
  {
    title: 'Hoggard Soccer — Defending 8A State Champions',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'New Hanover',
    location: 'Hoggard High School — Wilmington, NC',
    description: 'Team coverage. 2025 Season: 22-1-2 · 8A State Champions · Best regular season record in 8A. Story: Won 8A with the best record in the class. Wilmington is a strong creator market. Hoggard also had a deep volleyball run. One school, multiple major sport stories. Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Marvin Ridge Soccer — Defending 7A Champions',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Union',
    location: 'Marvin Ridge High School — Waxhaw, NC',
    description: 'Team coverage. 2025 Season: 22-3-1 · 7A State Champions. Also won 7A volleyball title. Story: 7A soccer champions AND 7A volleyball champions in the same school year. The singular most important program story in NC heading into fall 2026. SWEEP: Charlotte-area creators can cover soccer team + volleyball team + Victoria Simons + Keven Lopez-Ramirez in one visit. Coverage: Team Feature + Dual-Sport Story.'
  },
  {
    title: 'Western Alamance Soccer — Defending 5A Champions',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Western Alamance High School — Burlington, NC',
    description: 'Team coverage. 2025 Season: 5A State Champions. Grant Bacchus (Class 2028, 45 goals) returns as the lead scorer. Story: State champions with their leading scorer returning as a junior. Burlington/Alamance County is accessible from both the Triad and Triangle. SWEEP: Western Alamance visit covers soccer team + Grant Bacchus + Elio Anguiano + Reese Walker (volleyball). Coverage: Team Practice Day + Player Coverage.'
  },
  {
    title: 'West Forsyth Soccer — 8A Runner-Up',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'West Forsyth High School — Clemmons, NC',
    description: 'Team coverage. 2025 Season: 20-3-2 · Won the 8A West regional final · Lost championship to Hoggard. Story: The most likely program to challenge Hoggard for the 8A title in 2026. Won the West bracket. NOTE: West Forsyth also reached the 8A volleyball final — Forsyth County trip covers Leo Blacutt (soccer assists), Darey Lopez-Martinez (Glenn), and volleyball stories. Coverage: Team Practice Day Coverage.'
  },
  {
    title: 'Charlotte Catholic Soccer — 6A State Champions',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Mecklenburg',
    location: 'Charlotte Catholic High School — Charlotte, NC',
    description: 'Team coverage. 2025 Season: 6A State Champions (won on penalty kicks over Middle Creek, 22-4-1 overall). Story: Won the 6A title in one of the most dramatic championship finishes of the year — penalty kicks. Catholic is a perennial private school powerhouse. Charlotte creators have direct access. Coverage: Team Feature + Interview.'
  },

  // New soccer scorers
  {
    title: 'Isaiah Betton — Richlands, 44 Goals',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Onslow',
    location: 'Richlands High School — Richlands, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 44 goals · 9 assists · 97 points in 23 games. Story: Top returning scorer in Onslow County. Richlands is a program in the Jacksonville/Onslow market that rarely gets attention. NOTE: One trip to Onslow County covers Isaiah Betton + Amari Pearson (football RB, Jacksonville) + Reginald Gray (football QB) + Phoenix Villanueva (GK, Swansboro). Coverage: Player Spotlight.'
  },
  {
    title: 'Yair Avila — Bessemer City, 36 Goals',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Gaston',
    location: 'Bessemer City High School — Bessemer City, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 36 goals · 14 assists · 86 points in 20 games. Story: Top returning scorer in Gaston County. Bessemer City is a small Gaston County program that rarely sees coverage. NOTE: One trip to Gaston County also covers Olivia Easton (volleyball, South Point, 432 kills). Coverage: Player Spotlight.'
  },
  {
    title: 'Darey Lopez-Martinez — Glenn, 32 Goals + 21 Assists',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'Glenn High School — Kernersville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 32 goals · 21 assists · 85 points in 24 games — elite dual-threat scorer. Story: 32 goals and 21 assists is a combination that almost no returning player in NC matches. Glenn is in Forsyth County — Triad-area access. NOTE: Forsyth County trip also covers Owen Justice (Ragsdale), Leo Blacutt (Bishop McGuinness), Elly Randolph (Reagan volleyball), and Hadley Lichty (West Forsyth volleyball). Coverage: Player Spotlight.'
  },
  {
    title: 'Edwin Ramirez — West Lincoln, 33 Goals',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Lincoln',
    location: 'West Lincoln High School — Lincolnton, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 33 goals · 11 assists · 77 points in 22 games. Story: Top returning scorer in Lincoln County soccer. SWEEP: Lincoln County is the highest-ROI single county on the list — Jaxon Dollar (TE, football), Rashad Lynch (QB), RJ Lynch (WR), Edwin Ramirez (soccer), and Cameron Kupsco (GK) all in the same county. Coverage: Player Spotlight.'
  },
  {
    title: 'David Valdez — North Pitt, 30 Goals',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Pitt',
    location: 'North Pitt High School — Bethel, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 30 goals · 17 assists · 77 points in 22 games. Story: Top returning scorer in Pitt County outside of Greenville city schools. North Pitt is a rural Pitt County program that doesn\'t get attention. NOTE: Greenville-area creators can stack this with D.H. Conley (volleyball) and Jaleek Parson (J.H. Rose football). Coverage: Player Spotlight.'
  },

  // New assist leaders
  {
    title: 'Elio Anguiano — Western Alamance, 27 Assists',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Alamance',
    location: 'Western Alamance High School — Burlington, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 29 goals · 27 assists · 85 points in 24 games — elite assist volume on a state championship team. Story: Third-most assists of any returning player in NC. The creative engine behind Western Alamance\'s 5A title alongside Grant Bacchus. SWEEP: Same school as Grant Bacchus — both covered in one practice visit. Coverage: Player Spotlight.'
  },
  {
    title: 'Keven Lopez-Ramirez — Monroe, 29 Assists',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Union',
    location: 'Monroe High School — Monroe, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 29 assists · 1.38 assists/game. Story: One of the top assist leaders returning in NC. Monroe is in Union County — same county as Marvin Ridge (dual-sport dynasty). A Charlotte-area creator can cover Keven Lopez-Ramirez at Monroe and the Marvin Ridge soccer + volleyball stories in the same county. Coverage: Player Spotlight.'
  },
  {
    title: 'Leo Blacutt — Bishop McGuinness, 29 Assists',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Forsyth',
    location: 'Bishop McGuinness Catholic High School — Winston-Salem, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 29 assists · 1.45 assists/game — elite distribution rate. Story: One of the most creative playmakers in NC soccer at a private school in Winston-Salem. Forsyth County trip covers multiple stories. Coverage: Player Spotlight.'
  },
  {
    title: 'Elvis Manzo-Pineda — Holmes, 28 Assists',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Anson',
    location: 'Holmes High School — Ansonville, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 28 assists · 1.12 assists/game. Story: Top playmaker in one of the most underserved counties in NC. Anson County is south of Charlotte near the SC border — extremely underserved market. A creator trip to Holmes would be genuinely groundbreaking coverage. Coverage: Player Spotlight.'
  },

  // New GKs
  {
    title: 'Jayden Duran — South Granville GK, 397 Saves',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Granville',
    location: 'South Granville High School — Creedmoor, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 397 saves · 3.94 GAA in 23 games. Story: #2 returning goalkeeper in NC by save total. 397 saves is a massive workload — the story of a keeper holding their team in games all season. Granville County (Creedmoor area) is north of Durham — Triangle-area creator access. Coverage: Player Spotlight.'
  },
  {
    title: 'Phoenix Villanueva — Swansboro GK, 267 Saves',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Onslow',
    location: 'Swansboro High School — Swansboro, NC',
    description: 'Class of 2028 — Rising Junior. 2025 Stats: 267 saves · 1.95 GAA in 20 games — elite save percentage. Story: One of the best returning GKs on the coast. Swansboro/Onslow County is underserved. SWEEP: One trip to Onslow County covers Villanueva + Isaiah Betton (soccer) + Amari Pearson (football) + Reginald Gray (football). Coverage: Player Spotlight.'
  },
  {
    title: 'Ben Jaffe — South Stokes GK, 244 Saves',
    sport: "Men's Soccer", event_type: 'Practice / Feature', county: 'Stokes',
    location: 'South Stokes High School — Walnut Cove, NC',
    description: 'Class of 2027 — Rising Senior. 2025 Stats: 244 saves · 2.24 GAA in 21 games. Story: Top returning GK in Stokes County. South Stokes is in the rural northwest corner of NC — Stokes County almost never gets coverage. A creator willing to make this trip would be doing truly first-in-market work. Coverage: Player Spotlight.'
  }
]

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

async function main() {
  console.log(`Inserting ${gigs.length} gigs...`)

  const payload = gigs.map(g => ({
    ...g,
    gig_type: 'standard',
    status: 'open',
    event_date: null
  }))

  const res = await sb('/rest/v1/gigs', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Insert failed:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  const inserted = Array.isArray(data) ? data.length : '?'
  console.log(`✓ Inserted ${inserted} gigs`)

  // Fetch all creator emails for bulk notification
  const profRes = await sb('/rest/v1/collaborator_profiles?select=email&email=not.is.null')
  const profiles = await profRes.json()
  const emails = (profiles || []).map(p => p.email).filter(Boolean)

  if (emails.length) {
    console.log(`Sending bulk notification to ${emails.length} creators...`)
    const notifyRes = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'gigs_bulk_posted',
        payload: { creator_emails: emails, gig_count: inserted }
      })
    })
    if (notifyRes.ok) console.log('✓ Notification sent')
    else console.warn('Notification failed:', await notifyRes.text())
  }

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
