const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");

// Load dark mode preference
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

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Add task
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

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
});

// Add task on button click
addTaskBtn.addEventListener("click", addTask);

// Add task on Enter key
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// Initialize theme
loadTheme();

