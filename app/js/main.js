// Leonida Ledger — boot: loads the data, wires the toolbar, routes the views.
import { KIND_FILTERS, GRADES, ROADMAP_STAGES } from './config.js';
import { loadTrophies, countByGrade } from './data.js';
import { loadProgress, saveProgress, isEarned, toggleEarned, exportProgress, importProgressFile } from './store.js';
import { applyFilters, nextUnearnedInRoadmap } from './filters.js';
import { renderChecklist } from './render-list.js';
import { renderDetail } from './render-detail.js';
import { renderRoadmap, renderMissables, onlineNoteText } from './render-roadmap.js';

const listView = document.getElementById('listView');
const roadmapView = document.getElementById('roadmapView');
const missablesView = document.getElementById('missablesView');
const detailPane = document.getElementById('detailPane');
const trophyList = document.getElementById('trophyList');
const emptyList = document.getElementById('emptyList');
const showingLine = document.getElementById('showingLine');
const viewNote = document.getElementById('viewNote');
const content = document.querySelector('.content');
const searchInput = document.getElementById('search');
const gradeFilter = document.getElementById('gradeFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const kindChips = document.getElementById('kindChips');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const earnedCountEl = document.getElementById('earnedCount');
const meterFill = document.getElementById('meterFill');
const meter = document.getElementById('meter');
const gradeCountsEl = document.getElementById('gradeCounts');
const nextUpEl = document.getElementById('nextUp');

let trophies = [];
let sources = {};
let progress = loadProgress();
let selectedId = 1;
let currentView = 'checklist';

function refreshAll() {
  saveProgress(progress);
  refreshHeader();
  refreshChips();
  if (currentView === 'checklist') renderChecklistView();
  if (currentView === 'roadmap') renderRoadmap(roadmapView, trophies, progress);
  if (currentView === 'missables') renderMissables(missablesView, trophies, progress);
}

function refreshHeader() {
  const earned = progress.earned.length;
  earnedCountEl.textContent = String(earned);
  meterFill.style.width = Math.round((earned / trophies.length) * 100) + '%';
  meter.setAttribute('aria-valuenow', String(earned));
  gradeCountsEl.textContent = GRADES.map(
    (grade) => countByGrade(trophies.filter((t) => isEarned(progress, t.id)), grade) + ' ' + grade,
  ).join(' · ');
  const next = nextUnearnedInRoadmap(trophies, progress);
  nextUpEl.innerHTML = '';
  if (next) {
    const label = document.createElement('span');
    label.textContent = 'Next up: ';
    const strong = document.createElement('strong');
    strong.textContent = next.name + ' (Stage ' + next.stage + ')';
    nextUpEl.append(label, strong);
  } else {
    nextUpEl.textContent = 'Every trophy earned — Leonida Legend.';
  }
}

function refreshChips() {
  kindChips.innerHTML = '';
  for (const kind of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = kind.label;
    chip.setAttribute('aria-pressed', String(progress.kind === kind.id));
    chip.addEventListener('click', () => {
      progress.kind = kind.id;
      refreshAll();
    });
    kindChips.appendChild(chip);
  }
}

function renderChecklistView() {
  const filtered = applyFilters(trophies, progress, searchInput.value);
  renderChecklist(trophyList, filtered, progress, selectedId, selectTrophy, toggleTrophy);
  emptyList.hidden = filtered.length !== 0;
  showingLine.textContent =
    'Showing ' + filtered.length + ' of ' + trophies.length + ' trophies · ' + progress.earned.length + ' earned';
  const selected = trophies.find((trophy) => trophy.id === selectedId) || null;
  renderDetail(detailPane, selected, sources, progress, toggleTrophy);
  viewNote.textContent =
    progress.kind === 'online'
      ? onlineNoteText()
      : progress.spoiler
        ? 'Spoiler setting on: story trophies you have not earned yet show as hidden. Turn it off to reveal them, or earn them in the game.'
        : 'Click a trophy to read its guide and sources. Tick the box — or the button in the guide — to mark it earned; progress is saved in this browser.';
}

function selectTrophy(id) {
  selectedId = id;
  renderChecklistView();
}

function toggleTrophy(id) {
  progress = toggleEarned(progress, id);
  refreshAll();
}

function setView(view) {
  currentView = view;
  listView.hidden = view !== 'checklist';
  roadmapView.hidden = view !== 'roadmap';
  missablesView.hidden = view !== 'missables';
  content.classList.toggle('single', view !== 'checklist');
  document.getElementById('tabChecklist').classList.toggle('active', view === 'checklist');
  document.getElementById('tabRoadmap').classList.toggle('active', view === 'roadmap');
  document.getElementById('tabMissables').classList.toggle('active', view === 'missables');
  if (view === 'roadmap') {
    viewNote.textContent = 'Built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order.';
    renderRoadmap(roadmapView, trophies, progress);
  } else if (view === 'missables') {
    viewNote.textContent = 'Flagged from the official descriptions — a story choice, or a one-off moment. Keep a save before any big decision.';
    renderMissables(missablesView, trophies, progress);
  } else {
    renderChecklistView();
  }
}

function routeFromHash() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/roadmap')) setView('roadmap');
  else if (hash.startsWith('#/missables')) setView('missables');
  else if (hash.startsWith('#/trophy/')) {
    const id = Number.parseInt(hash.slice('#/trophy/'.length), 10);
    if (Number.isInteger(id) && trophies.some((trophy) => trophy.id === id)) selectedId = id;
    setView('checklist');
  } else setView('checklist');
}

async function boot() {
  try {
    const data = await loadTrophies();
    trophies = data.trophies;
    sources = data.sources;
  } catch (error) {
    viewNote.textContent = 'Could not load the trophy list: ' + error.message;
    return;
  }

  searchInput.addEventListener('input', renderChecklistView);
  gradeFilter.value = progress.grade;
  gradeFilter.addEventListener('change', () => {
    progress.grade = gradeFilter.value;
    refreshAll();
  });
  spoilerToggle.checked = progress.spoiler;
  spoilerToggle.addEventListener('change', () => {
    progress.spoiler = spoilerToggle.checked;
    refreshAll();
  });
  exportBtn.addEventListener('click', () => exportProgress(progress));
  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    try {
      const earned = await importProgressFile(file, trophies.map((trophy) => trophy.id));
      progress = { ...progress, earned };
      refreshAll();
      viewNote.textContent = 'Imported ' + earned.length + ' earned trophies from ' + file.name + '.';
    } catch (error) {
      viewNote.textContent = 'Import failed: ' + error.message;
    }
    importFile.value = '';
  });
  window.addEventListener('hashchange', routeFromHash);

  document.getElementById('listFacts').textContent =
    trophies.length +
    ' trophies · ' +
    GRADES.map((grade) => countByGrade(trophies, grade) + ' ' + grade).join(' · ') +
    ' · 28 hidden on PlayStation until earned';

  refreshAll();
  routeFromHash();
}

boot();
