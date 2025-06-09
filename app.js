// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");

// Load tasks or empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load saved theme or default light mode
function loadTheme() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

// Save theme preference
function saveTheme(darkMode) {
  localStorage.setItem("darkMode", darkMode);
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
    clearAllBtn.disabled = true;
    return;
  } else {
    emptyState.hidden = true;
    clearAllBtn.disabled = false;
  }

  // Sort incomplete first, then by due date
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const now = new Date();

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    // Mark overdue with red border if due date passed & not completed
    if (task.dueDate && !task.completed && new Date(task.dueDate) < now) {
      li.style.borderLeft = "4px solid #f44336";
    } else {
      li.style.borderLeft = "none";
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Task description
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = "task-text";
    if (task.completed) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "gray";
    }

    // Due date span
    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    dueDateSpan.textContent = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "";

    // Priority span with color
    const prioritySpan = document.createElement("span");
    prioritySpan.className = "priority";
    prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    if (task.priority === "high") {
      prioritySpan.style.color = "#d32f2f"; // red
      prioritySpan.style.fontWeight = "bold";
    } else if (task.priority === "medium") {
      prioritySpan.style.color = "#f57c00"; // orange
    } else {
      prioritySpan.style.color = "#388e3c"; // green
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // Append elements
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(dueDateSpan);
    li.appendChild(prioritySpan);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Please enter a task description.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    dueDate: dueDateInput.value || null,
    priority: prioritySelect.value,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "medium";
  taskInput.focus();
}

// Clear all tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  saveTheme(isDark);
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Setup listeners
function setupEventListeners() {
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });
  clearAllBtn.addEventListener("click", clearAllTasks);
  themeToggle.addEventListener("click", toggleTheme);
}

// Initialize app
function init() {
  loadTheme();
  renderTasks();
  setupEventListeners();
  taskInput.focus();
}

init();

