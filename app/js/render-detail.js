// Leonida Ledger — renders the guide detail pane for one trophy.
import { GUIDE_NOTE } from './config.js';
import { isEarned } from './store.js';
import { gradeLabel } from './render-list.js';
import { KIND_LABELS } from './config.js';
import { isSpoilerHidden } from './filters.js';

export function renderDetail(pane, trophy, sources, progress, onToggle) {
  pane.innerHTML = '';
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Select a trophy from the checklist to read its guide.';
    pane.appendChild(empty);
    return;
  }

  const earned = isEarned(progress, trophy.id);
  const hidden = isSpoilerHidden(trophy, progress);

  const gradeTag = document.createElement('span');
  gradeTag.className = 'tag grade-' + trophy.grade;
  gradeTag.textContent = gradeLabel(trophy.grade) + ' trophy';
  pane.appendChild(gradeTag);

  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  pane.appendChild(title);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'Spoiler setting is on. Earn this story trophy in the game to reveal its name and description here.'
    : 'Official description: “' + trophy.description + '”';
  pane.appendChild(official);

  const meta = document.createElement('p');
  meta.className = 'trophy-tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[trophy.kind] || trophy.kind;
  const stageTag = document.createElement('span');
  stageTag.className = 'tag';
  stageTag.textContent = 'Roadmap stage ' + trophy.stage;
  meta.append(kindTag, stageTag);
  if (trophy.missable) {
    const missTag = document.createElement('span');
    missTag.className = 'tag missable';
    missTag.textContent = 'Missable';
    meta.appendChild(missTag);
  }
  pane.appendChild(meta);

  if (trophy.missable && trophy.missableNote) {
    const banner = document.createElement('p');
    banner.className = 'missable-banner';
    banner.textContent = '⚠ ' + trophy.missableNote;
    pane.appendChild(banner);
  }

  if (!hidden) {
    const guideLabel = document.createElement('p');
    guideLabel.className = 'guide-label';
    guideLabel.textContent = 'Guide — our own words';
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    pane.append(guideLabel, guide);

    const sourcesLabel = document.createElement('p');
    sourcesLabel.className = 'sources-label';
    sourcesLabel.textContent = 'Sources';
    const list = document.createElement('ul');
    list.className = 'sources';
    for (const key of trophy.sources || []) {
      const source = sources[key];
      if (!source) continue;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.label;
      item.appendChild(link);
      item.appendChild(document.createTextNode(' — name, description & grade'));
      list.appendChild(item);
    }
    const own = document.createElement('li');
    own.textContent = 'Guide advice: our own reading of the official description — not yet checked in the game.';
    list.appendChild(own);
    pane.append(sourcesLabel, list);

    const note = document.createElement('p');
    note.className = 'honest-note';
    note.textContent = GUIDE_NOTE;
    pane.appendChild(note);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'earn-btn' + (earned ? ' earned' : '');
  button.textContent = earned ? '✓ Earned — click to unmark' : 'Mark as earned';
  button.addEventListener('click', () => onToggle(trophy.id));
  pane.appendChild(button);
}
