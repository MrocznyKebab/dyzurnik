const defaultWorkplaces = [
  { id: 1, name: "Szpital Wyszyńskiego", stationaryRate: 80, onCallRate: 30 },
  { id: 2, name: "Przychodnia Waligóry", stationaryRate: 70, onCallRate: 25 }
];

const defaultDuties = [
  { 
    id: 1, 
    date: "2026-09-12", 
    startTime: "07:00", 
    endTime: "19:00", 
    workplaceId: 1, 
    stationaryHours: 8, 
    onCallHours: 4,
    settled: false
  }
];

let workplaces = JSON.parse(localStorage.getItem('workplaces')) || defaultWorkplaces;
let duties = JSON.parse(localStorage.getItem('duties')) || defaultDuties;
let selectedMonthFilter = null; 

const views = {
  dashboard: document.getElementById('dashboard'),
  form: document.getElementById('duty-form'),
  settings: document.getElementById('settings')
};

const navButtons = {
  dashboard: document.getElementById('nav-dashboard'),
  form: document.getElementById('nav-form'),
  settings: document.getElementById('nav-settings')
};

function switchView(targetView) {
  Object.values(views).forEach(view => view.classList.add('hidden'));
  Object.values(navButtons).forEach(btn => btn?.classList.remove('active'));
  
  views[targetView].classList.remove('hidden');
  if (navButtons[targetView]) navButtons[targetView].classList.add('active');

  if (targetView === 'dashboard') {
    renderDuties();
  } else if (targetView === 'form') {
    populateWorkplaceSelect();
  } else if (targetView === 'settings') {
    renderSettingsWorkplaces();
  }
}

Object.keys(navButtons).forEach(key => {
  navButtons[key]?.addEventListener('click', () => {
    if (key === 'form') {
      prepareFormForAdd();
    }
    switchView(key);
  });
});

function calculateDutyPay(duty) {
  const workplace = workplaces.find(place => place.id === Number(duty.workplaceId));

  if (!workplace) {
    return null;
  }

  const stationaryPay = duty.stationaryHours * workplace.stationaryRate;
  const onCallPay = duty.onCallHours * workplace.onCallRate;

  return {
    stationaryPay,
    onCallPay,
    totalPay: stationaryPay + onCallPay,
    totalHours: Number(duty.stationaryHours) + Number(duty.onCallHours)
  };
}

function updateSummary(filteredDuties) {
  let totalStatHours = 0;
  let totalCallHours = 0;
  let totalPayout = 0;

  filteredDuties.forEach(duty => {
    const payInfo = calculateDutyPay(duty);
    if (payInfo) {
      totalStatHours += Number(duty.stationaryHours);
      totalCallHours += Number(duty.onCallHours);
      totalPayout += payInfo.totalPay;
    }
  });

  document.getElementById('sum-stat').innerText = `${totalStatHours} h`;
  document.getElementById('sum-call').innerText = `${totalCallHours} h`;
  document.getElementById('sum-total').innerText = `${totalStatHours + totalCallHours} h`;
  document.getElementById('sum-pay').innerText = `${totalPayout} zł`;
}

function renderDuties() {
  const listContainer = document.getElementById('duties-list');
  listContainer.innerHTML = '';

  const filteredDuties = duties.filter(duty => {
    if (!selectedMonthFilter) return true;
    const dutyMonth = new Date(duty.date).getMonth() + 1;
    return dutyMonth === selectedMonthFilter;
  });

  filteredDuties.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredDuties.length === 0) {
    listContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Brak zapisanych dyżurów dla wybranego okresu.</p>';
    updateSummary([]);
    return;
  }

  filteredDuties.forEach(duty => {
    const workplace = workplaces.find(wp => wp.id === Number(duty.workplaceId));
    const wpName = workplace ? workplace.name : 'Nieznane miejsce';
    const payInfo = calculateDutyPay(duty);
    const totalPay = payInfo ? payInfo.totalPay : 0;

    const card = document.createElement('div');
    card.className = 'duty-card';
    card.innerHTML = `
      <div class="duty-card-info">
        <h4>${duty.date} — ${wpName}</h4>
        <p>Godziny: ${duty.startTime} - ${duty.endTime} | Stacjonarnie: <strong>${duty.stationaryHours}h</strong> | Pod telefonem: <strong>${duty.onCallHours}h</strong></p>
        <p style="margin-top: 4px; color: #10b981; font-weight: 600;">Zarobek: ${totalPay} zł</p>

        <label class="settled-label">
          <input 
            type="checkbox" 
            ${duty.settled ? 'checked' : ''} 
            onchange="handleToggleSettled(${duty.id})"
          >
          Rozliczony
        </label>
      </div>

      <div class="duty-card-actions">
        <button class="btn-edit" onclick="handleEditDuty(${duty.id})">Edytuj</button>
        <button class="btn-delete" onclick="handleDeleteDuty(${duty.id})">Usuń</button>
      </div>
    `;

    listContainer.appendChild(card);
  });

  updateSummary(filteredDuties);
}

const dutyForm = document.getElementById('form-add-duty');

function populateWorkplaceSelect() {
  const select = document.getElementById('duty-workplace');
  select.innerHTML = '';
  
  if (workplaces.length === 0) {
    select.innerHTML = '<option value="" disabled>Dodaj najpierw miejsca pracy w Ustawieniach!</option>';
    return;
  }

  workplaces.forEach(wp => {
    const opt = document.createElement('option');
    opt.value = wp.id;
    opt.textContent = wp.name;
    select.appendChild(opt);
  });
}

function prepareFormForAdd() {
  document.getElementById('form-title').innerText = "Dodaj dyżur";
  document.getElementById('duty-id').value = "";
  dutyForm.reset();
}

dutyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const idValue = document.getElementById('duty-id').value;

  const existingDuty = idValue
    ? duties.find(d => d.id === Number(idValue))
    : null;

  const dutyData = {
    id: idValue ? Number(idValue) : Date.now(),
    date: document.getElementById('duty-date').value,
    startTime: document.getElementById('duty-start').value,
    endTime: document.getElementById('duty-end').value,
    workplaceId: Number(document.getElementById('duty-workplace').value),
    stationaryHours: Number(document.getElementById('duty-stat').value),
    onCallHours: Number(document.getElementById('duty-call').value),
    settled: existingDuty ? existingDuty.settled : false
  };

  if (idValue) {
    const index = duties.findIndex(d => d.id === Number(idValue));
    if (index !== -1) duties[index] = dutyData;
  } else {
    duties.push(dutyData);
  }

  saveData();
  dutyForm.reset();
  switchView('dashboard');
});

window.handleEditDuty = function(id) {
  const duty = duties.find(d => d.id === id);
  if (!duty) return;

  switchView('form');
  
  document.getElementById('form-title').innerText = "Edytuj dyżur";
  document.getElementById('duty-id').value = duty.id;
  document.getElementById('duty-date').value = duty.date;
  document.getElementById('duty-start').value = duty.startTime;
  document.getElementById('duty-end').value = duty.endTime;
  
  populateWorkplaceSelect();

  document.getElementById('duty-workplace').value = duty.workplaceId;
  document.getElementById('duty-stat').value = duty.stationaryHours;
  document.getElementById('duty-call').value = duty.onCallHours;
};

window.handleDeleteDuty = function(id) {
  if (confirm("Czy na pewno chcesz usunąć ten dyżur?")) {
    duties = duties.filter(d => d.id !== id);
    saveData();
    renderDuties();
  }
};

window.handleToggleSettled = function(id) {
  const duty = duties.find(d => d.id === id);

  if (!duty) return;

  duty.settled = !duty.settled;

  saveData();
  renderDuties();
};

function setupMonthFilters() {
  const monthButtons = document.querySelectorAll('.months button');
  
  const monthMap = {
    'Czerwiec': 6,
    'Lipiec': 7,
    'Sierpień': 8
  };

  monthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMonth = monthMap[btn.textContent.trim()];
      
      if (selectedMonthFilter === targetMonth) {
        selectedMonthFilter = null;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      } else {
        monthButtons.forEach(b => {
          b.style.backgroundColor = '';
          b.style.color = '';
        });

        selectedMonthFilter = targetMonth;
        btn.style.backgroundColor = 'var(--primary)';
        btn.style.color = 'white';
      }

      renderDuties();
    });
  });
}

const workplaceForm = document.getElementById('form-add-workplace');

if (workplaceForm) {
  workplaceForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newWp = {
      id: Date.now(),
      name: document.getElementById('wp-name').value,
      stationaryRate: Number(document.getElementById('wp-stat-rate').value),
      onCallRate: Number(document.getElementById('wp-call-rate').value)
    };

    workplaces.push(newWp);
    saveData();
    workplaceForm.reset();
    renderSettingsWorkplaces();
  });
}

function renderSettingsWorkplaces() {
  const container = document.getElementById('workplaces-list');
  if (!container) return;

  container.innerHTML = '';

  workplaces.forEach(wp => {
    const item = document.createElement('div');
    item.className = 'duty-card';
    item.style.marginBottom = '8px';
    item.innerHTML = `
      <div>
        <strong>${wp.name}</strong> <br>
        <small>Stacjonarnie: ${wp.stationaryRate} zł/h | Pod telefonem: ${wp.onCallRate} zł/h</small>
      </div>
      <button class="btn-delete" onclick="handleDeleteWorkplace(${wp.id})">Usuń</button>
    `;

    container.appendChild(item);
  });
}

window.handleDeleteWorkplace = function(id) {
  if (confirm("Usunięcie miejsca pracy nie usunie przypisanych dyżurów, ale wpłynie na kalkulację ich stawek. Kontynuować?")) {
    workplaces = workplaces.filter(w => w.id !== id);
    saveData();
    renderSettingsWorkplaces();
  }
};

function saveData() {
  localStorage.setItem('duties', JSON.stringify(duties));
  localStorage.setItem('workplaces', JSON.stringify(workplaces));
}

document.addEventListener('DOMContentLoaded', () => {
  setupMonthFilters();
  renderDuties();
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = 'Tryb jasny ☀️';
  }

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    
    themeToggle.textContent = isDark ? 'Tryb jasny ☀️' : 'Tryb ciemny 🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
