// Leonida Ledger — saved progress: localStorage checklist, export and import.
import { STORAGE_KEY } from './config.js';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((id) => Number.isInteger(id)) : [],
      spoiler: parsed.spoiler === true,
      kind: typeof parsed.kind === 'string' ? parsed.kind : 'all',
      grade: typeof parsed.grade === 'string' ? parsed.grade : 'all',
    };
  } catch {
    return defaultProgress();
  }
}

export function defaultProgress() {
  return { earned: [], spoiler: false, kind: 'all', grade: 'all' };
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isEarned(progress, id) {
  return progress.earned.includes(id);
}

export function toggleEarned(progress, id) {
  const earned = new Set(progress.earned);
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  return { ...progress, earned: [...earned].sort((a, b) => a - b) };
}

export function exportProgress(progress) {
  const payload = {
    app: 'leonida-ledger',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...progress.earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file, totalIds) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const earned = Array.isArray(parsed.earned) ? parsed.earned : parsed;
  if (!Array.isArray(earned)) throw new Error('That file has no earned list.');
  const valid = new Set(totalIds);
  const cleaned = [...new Set(earned.filter((id) => Number.isInteger(id) && valid.has(id)))];
  return cleaned.sort((a, b) => a - b);
}
