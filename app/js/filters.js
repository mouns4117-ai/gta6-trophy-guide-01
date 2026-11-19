// Leonida Ledger — filtering: kind, grade, search text, and the spoiler rule.
export function applyFilters(trophies, progress, searchText) {
  const query = searchText.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (progress.kind === 'story' && trophy.kind !== 'story') return false;
    if (progress.kind === 'missable' && !trophy.missable) return false;
    if (progress.kind === 'collectible' && trophy.kind !== 'collectible') return false;
    if (progress.kind === 'activity' && trophy.kind !== 'activity') return false;
    if (progress.kind === 'online') return false;
    if (progress.kind === 'misc' && trophy.kind !== 'misc') return false;
    if (progress.grade !== 'all' && trophy.grade !== progress.grade) return false;
    if (query) {
      const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

// A story trophy is hidden while the spoiler setting is on and it is not earned.
export function isSpoilerHidden(trophy, progress) {
  return progress.spoiler && trophy.kind === 'story' && !progress.earned.includes(trophy.id);
}

export function nextUnearnedInRoadmap(trophies, progress) {
  const ordered = [...trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
  return ordered.find((trophy) => !progress.earned.includes(trophy.id)) || null;
}
