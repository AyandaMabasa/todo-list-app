// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
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
    return;
  }

  emptyState.hidden = true;
  taskList.innerHTML = tasks.map(task => `
    <li data-id="${task.id}">
      <span class="task-text" tabindex="0">${escapeHTML(task.text)}</span>
      ${task.dueDate ? `<span class="due-date">${formatDate(task.dueDate)}</span>` : ''}
      <button class="delete-btn" aria-label="Delete task">Delete</button>
    </li>
  `).join('');
}

// Event listeners
function setupEventListeners() {
  // Add task on button click or Enter key
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => e.key === 'Enter' && addTask());
  
  // Task actions
  taskList.addEventListener("click", handleTaskActions);
  
  // Clear all with confirmation
  clearAllBtn.addEventListener("click", clearAllTasks);
  
  // Theme toggle
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
    createdAt: new Date().toISOString()
  });

  saveTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
  taskInput.focus(); // Return focus to input
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

// Helper functions
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

// Security: Prevent XSS
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

// Initialize
document.addEventListener('DOMContentLoaded', init);
