// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const priorityInput = document.getElementById("priority-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");

// Task management
let tasks = loadTasks();
let nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

function init() {
  renderTasks();
  loadTheme();
  updateClearAllBtn();
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateClearAllBtn();
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    const text = document.createElement("span");
    text.textContent = task.text;

    const meta = document.createElement("small");
    meta.textContent = `${task.dueDate || "No due date"} • ${task.priority}`;
    meta.className = "task-meta";

    contentDiv.appendChild(text);
    contentDiv.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(checkbox);
    actions.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!text) return;

  tasks.push({
    id: nextId++,
    text,
    dueDate,
    priority,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "medium";
  taskInput.focus();
}

function clearAllTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function updateClearAllBtn() {
  clearAllBtn.disabled = tasks.length === 0;
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  }
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);
themeToggle.addEventListener("click", toggleTheme);

taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

document.addEventListener("DOMContentLoaded", init);

