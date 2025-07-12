// script.js - Alarm Clock with Modal Snooze

const clock = document.getElementById('clock');
const alarmList = document.getElementById('alarm-list');
const alarmAudio = document.getElementById('alarm-audio');
const toggleDark = document.getElementById('toggle-dark');
const alarmModal = document.getElementById('alarm-modal');
const modalLabel = document.getElementById('modal-label');

let alarms = [];
let currentAlarm = null;

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB');
  clock.textContent = timeStr;

  alarms.forEach((alarm, index) => {
    if (!alarm.rang && timeStr === alarm.time) {
      alarm.rang = true;
      currentAlarm = { alarm, index };
      triggerAlarm(alarm);
    }
  });
}

function triggerAlarm(alarm) {
  if (navigator.vibrate) navigator.vibrate([300, 200, 300]);
  alarmAudio.play().catch(() => console.warn("Autoplay blocked"));
  modalLabel.textContent = `⏰ Alarm: ${alarm.label || 'No Label'}`;
  alarmModal.classList.remove('hidden');
}

function stopAlarm() {
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  alarmModal.classList.add('hidden');
  currentAlarm = null;
}

function snoozeAlarm() {
  if (!currentAlarm) return;

  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);

  currentAlarm.alarm.time = now.toLocaleTimeString('en-GB');
  currentAlarm.alarm.rang = false;
  currentAlarm = null;

  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  alarmModal.classList.add('hidden');
  renderAlarms();
}

function setAlarm() {
  const timeInput = document.getElementById('alarm-time').value;
  const label = document.getElementById('alarm-label').value;
  if (!timeInput) return alert('Please select a time');

  const timeParts = timeInput.split(':');
  const formatted = `${timeParts[0]}:${timeParts[1]}:00`;

  alarms.push({ time: formatted, label, rang: false });
  renderAlarms();
}

function renderAlarms() {
  alarmList.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const div = document.createElement('div');
    div.className = 'alarm-item';
    div.id = `alarm-${index}`;
    div.innerHTML = `${alarm.time} - ${alarm.label || 'No Label'}
      <button onclick="removeAlarm(${index})">Delete</button>`;
    alarmList.appendChild(div);
  });
}

function removeAlarm(index) {
  alarms.splice(index, 1);
  renderAlarms();
}

toggleDark.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

setInterval(updateClock, 1000);
updateClock();