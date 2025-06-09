// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");

// Load tasks from localStorage or initialize empty
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateClearAllBtn();
  loadTheme();
});

// Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "medium";
  taskInput.focus();
});

// Clear All
clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateClearAllBtn();
}

// Load theme
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  tasks.forEach(task => {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    if (task.completed) textSpan.style.textDecoration = "line-through";
    textSpan.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    dueDateSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : "";

    const prioritySpan = document.createElement("span");
    prioritySpan.className = "priority";
    prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(textSpan);
    li.appendChild(prioritySpan);
    li.appendChild(dueDateSpan);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Enable or disable clear all button
function updateClearAllBtn() {
  clearAllBtn.disabled = tasks.length === 0;
}



