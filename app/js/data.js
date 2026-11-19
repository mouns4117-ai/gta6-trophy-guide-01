// Leonida Ledger — loads the trophy data (app/data/trophies.json) and nothing else.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json (' + response.status + ')');
  const data = await response.json();
  const trophies = Array.isArray(data) ? data : data.trophies;
  const sources = Array.isArray(data) ? {} : (data.sources || {});
  const guideNote = Array.isArray(data) ? '' : (data.guideNote || '');
  return { trophies, sources, guideNote };
}

export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id) || null;
}

export function countByGrade(trophies, grade) {
  return trophies.filter((trophy) => trophy.grade === grade).length;
}
