// Leonida Ledger — shared constants: storage key, kinds, grades, roadmap stages.
export const STORAGE_KEY = 'leonida-ledger-v1';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export const KIND_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
  { id: 'online', label: 'Online' },
  { id: 'misc', label: 'Other' },
];

export const KIND_LABELS = {
  story: 'Story',
  collectible: 'Collectible',
  activity: 'Activity',
  misc: 'Other',
};

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Story first',
    text: 'Play Chapters 1–4 and the finale in order. Twelve story trophies unlock automatically as you go: the four chapter trophies, the final-mission gold, and the seven named missions (Gone Fishing, Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory). Nothing here can be missed.',
    tip: 'Do not rush past side content entirely — stranger icons and character strands open up as the story progresses.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Side stories & the missables',
    text: 'Finish the character strands (Andy, Kenton, Billy, Randy, Tyrone) and 8 stranger mission strands. This stage also holds every trophy flagged missable: the story-choice trophy and the one-off moments. Do these before the finale where a choice is involved, and keep a save from before any big decision.',
    tip: 'Check the Missables tab first — it lists the six flagged trophies and why each one is flagged.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Activities',
    text: 'Work through the activities: 250 stunts, 42 Shooting Range challenges for gold, 20 different race wins, drone races at every Top Fun location, fishing against Cal, one arcade game, meditation at every spot, and Bret\u2019s unique-animal hunt. Add the driving and robbery trophies (Combat Focus, the VCIA departure, the Rhino, the jewelry store, the armored truck, bowling) as you pass them.',
    tip: 'Stunts and challenges build up across the whole game — start them early and they finish themselves.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Collectibles & the map',
    text: 'Hunt the collectibles: 3 card sets, WAiNK at 100 locations, 100 vehicles discovered, every region of Leonida explored, every gang\u2019s illegal operation robbed, 5 bank vaults, every garage property bought, $250,000 laundered and $100,000 spent, and 10 vehicles registered to the Scooter Bros app.',
    tip: 'Do this stage region by region so no collectible is left behind in a corner of the map.',
  },
  {
    stage: 5,
    title: 'Stage 5 — Cleanup & 100%',
    text: 'Finish the last 50 challenges, then push to 100% completion for the gold A Long Road. When the other 54 trophies are earned, the platinum Vice Got a Price! unlocks on its own.',
    tip: 'The checklist shows exactly what is left — filter by “not earned” in your head and clear one kind at a time.',
  },
];

export const ONLINE_NOTE =
  'The official list holds no online trophies: every one of the 55 is earned in single-player. This filter is here because the list could have had them — it does not.';

export const GUIDE_NOTE =
  'Guides are written in our own words from the trophy\u2019s official description. Where a step has not yet been checked in the game, the guide says so plainly instead of inventing a location.';
