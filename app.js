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

// Initialize app
function init() {
  renderTasks();
  setupEventListeners();
  loadTheme();
  taskInput.focus(); // Ensure focus on input
}

// Load tasks from localStorage
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

// Render all tasks
function renderTasks() {
  if (tasks.length === 0) {
    emptyState.hidden = false;
    taskList.innerHTML = '';
    updateClearAllBtn();
    return;
  }

  emptyState.hidden = true;
  // Sort tasks by priority (high > medium > low) then dueDate (earlier first)
  const priorityRank = { high: 3, medium: 2, low: 1 };
  tasks.sort((a, b) => {
    if (priorityRank[b.priority] !== priorityRank[a.priority]) {
      return priorityRank[b.priority] - priorityRank[a.priority];
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  taskList.innerHTML = tasks.map(task => `
    <li data-id="${task.id}">
      <span class="task-text" tabindex="0">${escapeHTML(task.text)}</span>
      ${task.dueDate ? `<span class="due-date">Due: ${formatDate(task.dueDate)}</span>` : ''}
      <span class="priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
      <button class="delete-btn" aria-label="Delete task">Delete</button>
    </li>
  `).join('');
  updateClearAllBtn();
}

// Event listeners
function setupEventListeners() {
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => e.key === 'Enter' && addTask());
  taskList.addEventListener("click", handleTaskActions);
  clearAllBtn.addEventListener("click", clearAllTasks);
  themeToggle.addEventListener("click", toggleTheme);
}

// Add new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push({
    id: nextId++,
    text: taskText,
    dueDate: dueDateInput.value || null,
    priority: priorityInput.value || 'medium',
    createdAt: new Date().toISOString()
  });

  saveTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "medium";
  renderTasks();
  taskInput.focus();
}

// Handle task actions
function handleTaskActions(e) {
  const taskItem = e.target.closest('li');
  if (!taskItem) return;

  const taskId = parseInt(taskItem.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    deleteTask(taskId);
  } else if (e.target.classList.contains("task-text")) {
    editTask(taskId);
  }
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText?.trim()) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Clear all tasks
function clearAllTasks() {
  if (!tasks.length || !confirm("Are you sure you want to clear all tasks?")) return;

  tasks = [];
  nextId = 1;
  saveTasks();
  renderTasks();
}

// Theme management
function toggleTheme() {
  const isDark = !document.body.classList.toggle("dark-mode");
  themeToggle.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  }
}

// Helpers
function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateClearAllBtn();
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
}

function updateClearAllBtn() {
  clearAllBtn.disabled = tasks.length === 0;
  clearAllBtn.title = tasks.length ? "" : "No tasks to clear";
}

function formatDate(dateString) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
}

// Init app
document.addEventListener('DOMContentLoaded', init);
