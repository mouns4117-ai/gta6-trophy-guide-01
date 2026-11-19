// Leonida Ledger — renders the checklist rows (name, description, grade, tags).
import { KIND_LABELS } from './config.js';
import { isEarned } from './store.js';
import { isSpoilerHidden } from './filters.js';

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function renderChecklist(listEl, trophies, progress, selectedId, onSelect, onToggle) {
  listEl.innerHTML = '';
  for (const trophy of trophies) {
    const earned = isEarned(progress, trophy.id);
    const hidden = isSpoilerHidden(trophy, progress);
    const row = document.createElement('li');
    row.className = 'trophy-row' + (earned ? ' earned' : '') + (trophy.id === selectedId ? ' selected' : '');
    row.dataset.id = String(trophy.id);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = earned;
    check.setAttribute('aria-label', 'Mark ' + (hidden ? 'hidden story trophy' : trophy.name) + ' earned');
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });

    const medal = document.createElement('span');
    medal.className = 'medal ' + trophy.grade;
    medal.title = gradeLabel(trophy.grade);
    medal.setAttribute('aria-label', gradeLabel(trophy.grade) + ' trophy');

    const body = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'trophy-name';
    name.textContent = hidden ? '' : trophy.name;
    if (hidden) {
      const span = document.createElement('span');
      span.className = 'hidden-name';
      span.textContent = 'Hidden story trophy — earn it to reveal';
      name.appendChild(span);
    }
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Spoiler setting is on: the name and description stay hidden until this story trophy is earned.' : trophy.description;
    const tags = document.createElement('p');
    tags.className = 'trophy-tags';
    tags.appendChild(tag('grade-' + trophy.grade, gradeLabel(trophy.grade)));
    tags.appendChild(tag('', KIND_LABELS[trophy.kind] || trophy.kind));
    tags.appendChild(tag('', 'Stage ' + trophy.stage));
    if (trophy.missable) tags.appendChild(tag('missable', 'Missable'));
    if (trophy.count) tags.appendChild(tag('', trophy.target || String(trophy.count)));
    body.append(name, desc, tags);

    const side = document.createElement('div');
    if (earned) {
      const mark = document.createElement('p');
      mark.className = 'trophy-check';
      mark.textContent = '✓ Earned';
      side.appendChild(mark);
    } else if (trophy.target) {
      const target = document.createElement('p');
      target.className = 'trophy-target';
      target.textContent = trophy.target;
      side.appendChild(target);
    }

    row.append(check, medal, body, side);
    row.addEventListener('click', () => onSelect(trophy.id));
    listEl.appendChild(row);
  }
}

function tag(className, text) {
  const el = document.createElement('span');
  el.className = 'tag' + (className ? ' ' + className : '');
  el.textContent = text;
  return el;
}
