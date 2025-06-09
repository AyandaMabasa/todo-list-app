// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");

// Task management
let tasks = loadTasks();
let nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

// Initialize app
function init() {
  renderTasks();
  setupEventListeners();
  loadTheme();
  taskInput.focus(); // Ensure focus on input
  updateClearAllBtn();
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

// Save tasks to localStorage
function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateClearAllBtn();
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
}

// Render all tasks
function renderTasks() {
  let filteredTasks = filterTasks(tasks, searchInput.value.trim());
  
  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    taskList.innerHTML = '';
    return;
  }

  emptyState.hidden = true;

  // Sort: incomplete first, then by due date ascending
  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const now = new Date();

  taskList.innerHTML = filteredTasks.map(task => {
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < now;
    const priorityClass = {
     

