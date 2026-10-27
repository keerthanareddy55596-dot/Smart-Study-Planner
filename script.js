const STORAGE_KEY = "smartStudyPlannerSessions";
const form = document.getElementById("sessionForm");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const dateInput = document.getElementById("date");
const startInput = document.getElementById("startTime");
const endInput = document.getElementById("endTime");
const typeInput = document.getElementById("studyType");
const editIdInput = document.getElementById("editId");
const filterDateInput = document.getElementById("filterDate");
const sessionList = document.getElementById("sessionList");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");

let sessions = loadSessions();

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function loadSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function saveSessions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function updateStats() {
  const today = localDateString();
  document.getElementById("totalSessions").textContent = sessions.length;
  document.getElementById("todaySessions").textContent = sessions.filter(item => item.date === today).length;
  document.getElementById("subjectCount").textContent = new Set(sessions.map(item => item.subject.trim().toLowerCase())).size;
}
function renderSessions() {
  const filter = filterDateInput.value;
  const visible = sessions
    .filter(item => !filter || item.date === filter)
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));

  emptyState.classList.toggle("hidden", visible.length > 0);
  sessionList.innerHTML = visible.map(item => `
    <article class="session">
      <div class="time-block">
        <strong>${escapeHTML(formatTime(item.startTime))}</strong>
        <span>to ${escapeHTML(formatTime(item.endTime))}</span>
      </div>
      <div class="session-info">
        <h3>${escapeHTML(item.subject)}</h3>
        <p>${escapeHTML(item.topic)}</p>
        <div class="pills">
          <span class="pill date-pill">${escapeHTML(formatDate(item.date))}</span>
          <span class="pill">${escapeHTML(item.type)}</span>
        </div>
      </div>
      <div class="session-actions">
        <button class="small-button" type="button" data-action="edit" data-id="${escapeHTML(item.id)}">Edit</button>
        <button class="small-button delete" type="button" data-action="delete" data-id="${escapeHTML(item.id)}">Delete</button>
      </div>
    </article>
  `).join("");
  updateStats();
}
function resetForm() {
  form.reset();
  editIdInput.value = "";
  dateInput.value = localDateString();
  document.getElementById("formHeading").textContent = "Add a study session";
  document.getElementById("submitButton").textContent = "Add session";
  document.getElementById("cancelEdit").classList.add("hidden");
}
form.addEventListener("submit", event => {
  event.preventDefault();
  formMessage.textContent = "";
  const subject = subjectInput.value.trim();
  const topic = topicInput.value.trim();
  const date = dateInput.value;
  const startTime = startInput.value;
  const endTime = endInput.value;
  if (!subject || !topic || !date || !startTime || !endTime) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }
  if (endTime <= startTime) {
    formMessage.textContent = "End time must be later than start time.";
    return;
  }
  const id = editIdInput.value;
  const record = { id: id || makeId(), subject, topic, date, startTime, endTime, type: typeInput.value };
  if (id) {
    sessions = sessions.map(item => item.id === id ? record : item);
    formMessage.textContent = "Study session updated successfully.";
  } else {
    sessions.push(record);
    formMessage.textContent = "Study session added successfully.";
  }
  saveSessions();
  resetForm();
  renderSessions();
});
sessionList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = sessions.find(session => session.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "delete") {
    if (!window.confirm(`Delete the "${item.subject}" study session?`)) return;
    sessions = sessions.filter(session => session.id !== item.id);
    saveSessions();
    renderSessions();
    if (editIdInput.value === item.id) resetForm();
  } else if (button.dataset.action === "edit") {
    editIdInput.value = item.id;
    subjectInput.value = item.subject;
    topicInput.value = item.topic;
    dateInput.value = item.date;
    startInput.value = item.startTime;
    endInput.value = item.endTime;
    typeInput.value = item.type;
    document.getElementById("formHeading").textContent = "Edit study session";
    document.getElementById("submitButton").textContent = "Save changes";
    document.getElementById("cancelEdit").classList.remove("hidden");
    formMessage.textContent = "";
    subjectInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
document.getElementById("cancelEdit").addEventListener("click", () => {
  resetForm();
  formMessage.textContent = "";
});
filterDateInput.addEventListener("change", renderSessions);
document.getElementById("clearFilter").addEventListener("click", () => {
  filterDateInput.value = "";
  renderSessions();
});
document.getElementById("todayLabel").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short", day: "numeric", month: "short", year: "numeric"
});
dateInput.value = localDateString();
renderSessions();
