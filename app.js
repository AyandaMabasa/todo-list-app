const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load dark mode preference from localStorage
function loadTheme() {
  const darkMode = localStorage.getItem("darkMode") === "enabled";
  if (darkMode) {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "Dark Mode";
  }
}

// Toggle dark mode and update localStorage
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Add a new task to the list
function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (taskText === "") return;

  const li = document.createElement("li");
  li.className = "task-item";

  const infoDiv = document.createElement("div");
  infoDiv.className = "task-info";
  infoDiv.innerHTML = `<strong>${taskText}</strong><br>
    <span class="task-meta">📅 ${dueDate || "No date"} | 🔥 ${priority}</span>`;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  li.appendChild(infoDiv);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Medium";
  taskInput.focus();
}

// Add task on button click
addTaskBtn.addEventListener("click", addTask);

// Add task on Enter key press
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
});

// Load initial theme preference
loadTheme();

// ✅ Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log("✅ Service Worker registered!", reg))
      .catch(err => console.error("❌ Service Worker registration failed:", err));
  });
}

