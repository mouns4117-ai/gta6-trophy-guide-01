// Leonida Ledger — renders the Roadmap to Platinum and Missables views.
import { ROADMAP_STAGES, ONLINE_NOTE } from './config.js';
import { isEarned } from './store.js';

export function renderRoadmap(view, trophies, progress) {
  view.innerHTML = '';
  const intro = document.createElement('p');
  intro.className = 'missable-intro';
  intro.textContent =
    'Five stages from a fresh save to the platinum, built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order. Trophies you have earned are struck through.';
  view.appendChild(intro);

  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('article');
    card.className = 'roadmap-stage';
    const stageTrophies = trophies.filter((trophy) => trophy.stage === stage.stage);
    const earnedCount = stageTrophies.filter((trophy) => isEarned(progress, trophy.id)).length;

    const title = document.createElement('h2');
    title.textContent = stage.title;
    const count = document.createElement('p');
    count.className = 'stage-progress';
    count.textContent = earnedCount + ' of ' + stageTrophies.length + ' trophies in this stage earned';
    const text = document.createElement('p');
    text.textContent = stage.text;
    const tip = document.createElement('p');
    tip.innerHTML = '';
    const tipLabel = document.createElement('strong');
    tipLabel.textContent = 'Tip: ';
    tip.append(tipLabel, document.createTextNode(stage.tip));
    const list = document.createElement('ul');
    for (const trophy of stageTrophies) {
      const item = document.createElement('li');
      if (isEarned(progress, trophy.id)) item.className = 'done';
      item.textContent =
        trophy.name + ' — ' + trophy.description + ' (' + trophy.grade + (trophy.missable ? ', missable' : '') + ')';
      list.appendChild(item);
    }
    card.append(title, count, text, tip, list);
    view.appendChild(card);
  }
}

export function renderMissables(view, trophies, progress) {
  view.innerHTML = '';
  const intro = document.createElement('p');
  intro.className = 'missable-intro';
  intro.textContent =
    'Story chapter and mission trophies are not flagged — they unlock through normal play. The six below are flagged from what their official descriptions imply, and the flags are our reading of the descriptions, not yet verified in the game.';
  view.appendChild(intro);

  const flagged = trophies.filter((trophy) => trophy.missable);
  for (const trophy of flagged) {
    const card = document.createElement('article');
    card.className = 'missable-card';
    const title = document.createElement('h2');
    title.textContent = trophy.name + (isEarned(progress, trophy.id) ? ' — ✓ earned' : '');
    const desc = document.createElement('p');
    desc.textContent = 'Official description: “' + trophy.description + '”';
    const why = document.createElement('p');
    why.className = 'why';
    why.textContent = trophy.missableNote || 'Flagged from the official description.';
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    card.append(title, desc, why, guide);
    view.appendChild(card);
  }

  const safe = document.createElement('p');
  safe.className = 'missable-intro';
  safe.textContent =
    'Everything else is safe to leave until later: chapter and mission trophies come from playing the story, and activities, collectibles and money trophies can be worked on at any time after the story opens the map.';
  view.appendChild(safe);
}

export function onlineNoteText() {
  return ONLINE_NOTE;
}
