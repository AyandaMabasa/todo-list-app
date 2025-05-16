// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");

// Task structure: { text: string, dueDate: string, id: number }
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

// Initialize app
function init() {
  renderTasks();
  updateClearAllBtn();
  loadTheme();
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      ${task.dueDate ? `<span class="due-date">${formatDate(task.dueDate)}</span>` : ''}
      <button class="delete-btn">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = {
      id: nextId++,
      text: taskText,
      dueDate: dueDateInput.value || null
    };
    
    tasks.push(newTask);
    saveTasks();
    
    taskInput.value = "";
    dueDateInput.value = "";
    renderTasks();
    updateClearAllBtn();
  }
});

// Handle task actions (delete/edit)
taskList.addEventListener("click", (e) => {
  const taskItem = e.target.closest('li');
  const taskId = parseInt(taskItem?.dataset.id);
  
  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateClearAllBtn();
  } else if (e.target.classList.contains("task-text")) {
    editTask(taskId);
  }
});

// Edit task function
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText && newText.trim()) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Clear All tasks
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    nextId = 1;
    saveTasks();
    renderTasks();
    updateClearAllBtn();
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Helper functions
function updateClearAllBtn() {
  clearAllBtn.disabled = tasks.length === 0;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  }
}

function formatDate(dateString) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the app
window.addEventListener('DOMContentLoaded', init);
    
