/* Static module metadata + rich fallback content (used when Gemini API key absent) */
const modules = [
  {
    id: 1, icon: '🗳️', title: 'Election Basics',
    description: 'What elections are, why they matter, and the types of elections held in a democracy.',
    difficulty: 'Beginner', readTime: '5 min',
    topic: 'election basics, types of elections, democracy fundamentals',
    content: `# Election Basics

## What Is an Election?
An election is a formal process by which citizens choose their representatives or decide on policies through a vote. It is a cornerstone of democracy.

## Why Do Elections Matter?
1. **Accountability** — Leaders are answerable to voters.
2. **Representation** — Citizens have a voice in governance.
3. **Peaceful transfer of power** — Prevents conflict over leadership.
4. **Policy direction** — Voters influence laws that affect daily life.

## Types of Elections
| Type | Purpose |
|------|---------|
| General Election | Choose national leaders (President, Parliament) |
| Primary Election | Choose party candidates before the general election |
| Local Election | Choose city mayors, councillors, school boards |
| By-election | Fill a seat vacated mid-term |
| Referendum | Vote directly on a specific law or policy |

## Did You Know?
> 🌍 Over 2 billion people voted in elections worldwide in 2024 — the largest single year of elections in history.

## Key Terms
- **Ballot** — The official form voters use to cast choices
- **Constituency** — A geographic area represented by one elected official
- **Mandate** — The authority given to a winning candidate by voters`
  },
  {
    id: 2, icon: '📋', title: 'Voter Registration',
    description: 'How to register to vote, eligibility requirements, and key deadlines.',
    difficulty: 'Beginner', readTime: '6 min',
    topic: 'voter registration, eligibility, how to register, deadlines',
    content: `# Voter Registration

## What Is Voter Registration?
Voter registration is the process of signing up with your government so you are eligible to vote in elections. Most countries require this step before Election Day.

## Eligibility Requirements (General)
1. **Age** — Usually 18 years old (some countries allow 16–17)
2. **Citizenship** — Must be a citizen of the country
3. **Residency** — Must live in the district where you register
4. **Mental competency** — Must not be legally declared incompetent
5. **Criminal record** — Rules vary; some countries restore voting rights after serving time

## How to Register — Step by Step
1. Gather required documents (ID, proof of address)
2. Visit your local election office OR register online (where available)
3. Complete the registration form accurately
4. Submit before the registration deadline
5. Confirm your registration is active before Election Day

## Key Deadlines
- Most countries close registration **15–30 days** before an election
- Some US states allow **same-day registration**
- Check your local election authority for exact dates

## Did You Know?
> 📌 Automatic Voter Registration (AVR) is now used in 20+ countries — citizens are registered automatically through government databases.`
  },
  {
    id: 3, icon: '🏛️', title: 'Candidates & Parties',
    description: 'How political parties work, how candidates are nominated, and what they stand for.',
    difficulty: 'Beginner', readTime: '7 min',
    topic: 'political parties, candidates, nominations, party platforms',
    content: `# Candidates & Political Parties

## What Is a Political Party?
A political party is an organized group of people who share similar beliefs about how government should work and seek to gain power through elections.

## How Parties Choose Candidates
1. **Primary elections** — Party members vote for their preferred candidate
2. **Caucuses** — Community meetings where voters openly show support
3. **Party conventions** — Delegates gather to formally nominate a candidate
4. **Appointment** — Party leadership selects candidate for some positions

## What Is a Platform?
A party platform is a list of goals and policies a party promises to pursue if elected. It covers areas like:
- Economy & taxation
- Healthcare & education
- Foreign policy
- Environment & energy

## Independent Candidates
Candidates who run without party affiliation are called **independents**. They must collect signatures (nomination papers) to appear on the ballot.

## Did You Know?
> 🏛️ The world's oldest political party still active today is the Democratic Party of the United States, founded in 1828.`
  },
  {
    id: 4, icon: '✅', title: 'The Voting Process',
    description: 'Step-by-step guide to what happens on Election Day at the polling station.',
    difficulty: 'Beginner', readTime: '6 min',
    topic: 'voting process, polling station, how to vote, ballot casting',
    content: `# The Voting Process

## Before Election Day
1. **Confirm your registration** — Check you are on the electoral roll
2. **Know your polling station** — Find your assigned location (online or by mail)
3. **Understand your ballot** — Research candidates and ballot measures in advance
4. **Arrange transportation** — Plan how you will get there

## At the Polling Station
1. **Arrive** and join the queue (polls are usually open 7 AM – 8 PM)
2. **Show ID** — Photo ID or voter card (requirements vary by country)
3. **Sign the register** — Confirm your identity in the electoral roll
4. **Receive your ballot** — Paper ballot or access to voting machine
5. **Mark your vote** — In secret booth; mark your chosen candidate(s)
6. **Cast your ballot** — Place in the ballot box or submit electronically
7. **Receive "I Voted" sticker** — Optional but traditional in many countries!

## Voting Methods
| Method | Description |
|--------|-------------|
| In-person | Traditional polling station voting |
| Postal/Absentee | Ballot mailed to your home |
| Early voting | Vote before Election Day at designated centres |
| Electronic | Digital voting machines (used in some countries) |

## Did You Know?
> 🗳️ Australia has **compulsory voting** — citizens can be fined for not voting. Turnout regularly exceeds 90%.`
  },
  {
    id: 5, icon: '🔢', title: 'How Votes Are Counted',
    description: 'The counting process, different electoral systems, and how winners are determined.',
    difficulty: 'Intermediate', readTime: '8 min',
    topic: 'vote counting, electoral systems, how winners are determined, results',
    content: `# How Votes Are Counted

## The Counting Process
1. **Polls close** — Ballot boxes are sealed and transported securely
2. **Counting begins** — Officials and party observers are present
3. **Ballots sorted** — Valid vs. spoiled/invalid ballots separated
4. **Votes tallied** — Manual count or machine scan
5. **Results verified** — Double-checked for accuracy
6. **Unofficial results announced** — Media calls results based on counts
7. **Official certification** — Government formally certifies results

## Electoral Systems
| System | How It Works | Used In |
|--------|-------------|---------|
| First Past the Post (FPTP) | Most votes wins, even without a majority | USA, UK, India |
| Proportional Representation | Seats allocated by vote share | Germany, Israel |
| Ranked Choice Voting | Voters rank candidates; lowest eliminated in rounds | Australia, Ireland |
| Two-Round System | Runoff between top two if no majority in round 1 | France, Brazil |

## What Makes a Ballot Invalid?
- Voting for more candidates than allowed
- Unclear marks that can't be interpreted
- Ballot not officially stamped
- Writing personal details on the ballot

## Did You Know?
> ⚡ In a close race, election officials may conduct a **recount** — re-tallying all votes manually or by machine to verify the result.`
  },
  {
    id: 6, icon: '📊', title: 'Results & Transition',
    description: 'What happens after an election: certification, transitions of power, and disputes.',
    difficulty: 'Intermediate', readTime: '7 min',
    topic: 'election results, certification, transition of power, disputes',
    content: `# Results & Transition of Power

## Timeline After Polls Close
1. **Election Night** — Media projects winners based on partial counts
2. **Days 1–7** — All votes counted, including postal/absentee ballots
3. **Certification** — Election authority officially certifies results
4. **Legal period** — Window for filing legal challenges
5. **Inauguration** — Winner sworn into office

## The Certification Process
- Each polling district submits totals to regional authority
- Regional authority totals are submitted to national authority
- Independent auditors review for accuracy
- Governing body (parliament, court) formally certifies

## Disputed Elections
If a candidate believes results are incorrect they may:
1. Request a **recount** — manual re-tally of all votes
2. File a **legal challenge** — court reviews evidence of fraud or errors
3. Submit an **election petition** — formal complaint to election authority

## Peaceful Transfer of Power
A hallmark of healthy democracy:
- Losing candidate concedes publicly
- Winner acknowledges all voters
- Outgoing officials brief incoming officials
- Inauguration ceremony held publicly

## Did You Know?
> 🌐 The longest election result dispute in history lasted **8 months** in Kenya's 2017 elections before the Supreme Court ordered a re-run.`
  },
  {
    id: 7, icon: '📅', title: 'Election Timeline',
    description: 'Key dates, deadlines, and the complete calendar of an election cycle.',
    difficulty: 'Intermediate', readTime: '5 min',
    topic: 'election calendar, key dates, election cycle, deadlines',
    content: `# Election Timeline

## The Full Election Cycle

### 12+ Months Before Election
- Election date officially announced
- Voter registration opens
- Political parties begin selecting candidates
- Campaign finance rules become active

### 6 Months Before
- Candidates officially declare their candidacy
- Campaign fundraising begins
- Voter registration continues

### 3 Months Before
- Primaries or party conventions held
- Official party candidates confirmed
- Campaign advertising begins

### 1 Month Before
- Voter registration deadline (in most countries)
- Early voting may open (2–4 weeks before)
- Final candidate debates held
- Postal ballot applications due

### Election Day
- Polling stations open (typically 7 AM – 8 PM)
- No campaigning within exclusion zone of polling stations
- Exit polls conducted (results published after polls close)
- Preliminary results announced overnight

### After Election Day
- Official vote count completed (1–7 days)
- Results certified (1–4 weeks)
- Legal challenge period (varies by country)
- Inauguration / swearing-in ceremony

## Did You Know?
> 📅 The US Presidential Election is always held on the **first Tuesday after the first Monday in November** — a tradition since 1845.`
  },
  {
    id: 8, icon: '💡', title: 'Myths vs Facts',
    description: 'Busting the most common election myths with facts and official sources.',
    difficulty: 'Beginner', readTime: '6 min',
    topic: 'election myths, misinformation, voter fraud facts, electoral misconceptions',
    content: `# Common Election Myths vs Facts

## Myth 1: "Voter fraud is widespread and changes election outcomes"
**FACT:** Verified cases of voter fraud are extremely rare — studies consistently find fraud rates of less than 0.0001% of votes cast. Multiple independent investigations in the US, UK, and other democracies have confirmed this.
**Source:** Brennan Center for Justice, MIT Election Lab

---

## Myth 2: "My vote doesn't matter — one vote never changes anything"
**FACT:** Many elections are decided by very small margins. The 2000 US Presidential Election in Florida was decided by 537 votes. Local elections are routinely decided by single digits.
**Source:** FairVote.org

---

## Myth 3: "Election results are always announced on Election Night"
**FACT:** Official certified results take days to weeks. Media projections on election night are estimates based on partial counts — not official results.

---

## Myth 4: "You can tell how someone voted"
**FACT:** Secret ballot systems ensure your vote is completely anonymous. No election official can link a ballot to a specific voter.

---

## Myth 5: "Non-citizens can vote and influence elections"
**FACT:** Non-citizens are legally prohibited from voting in national elections in virtually every democratic country. Registering to vote while ineligible is a criminal offence.

---

## Myth 6: "Dead people regularly vote in elections"
**FACT:** Electoral rolls are regularly audited and updated. When errors occur (e.g., a deceased person still on the roll), this is a clerical oversight — not evidence of fraud. No verified case of a dead person's ballot being cast intentionally has ever been documented at scale.

## Did You Know?
> 💡 Spreading election misinformation is a criminal offence in several countries, including Australia, where it carries a fine of up to AUD $13,000.`
  },
];

module.exports = modules;
