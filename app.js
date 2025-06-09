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
  taskInput.focus();
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
  const filteredTasks = filterTasks(tasks, searchInput?.value?.trim() || "");
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const now = new Date();

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";

    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < now;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" class="complete-checkbox">
        <div class="task-content">
          <p class="task-title ${task.completed ? "completed" : ""}">${task.text}</p>
          <div class="task-meta">
            ${task.dueDate ? `<span class="due-date ${isOverdue ? "overdue" : ""}">Due: ${task.dueDate}</span>` : ""}
            <span class="priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
        </div>
      </div>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (!text) return;

  const newTask = {
    id: nextId++,
    text,
    dueDate,
    priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Medium";
  taskInput.focus();
}

function setupEventListeners() {
  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  taskList.addEventListener("click", e => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete-btn")) {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
    } else if (e.target.classList.contains("complete-checkbox")) {
      const task = tasks.find(task => task.id === id);
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  });

  clearAllBtn.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
  });

  if (searchInput) {
    searchInput.addEventListener("input", renderTasks);
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

function filterTasks(taskList, searchTerm) {
  if (!searchTerm) return taskList;
  return taskList.filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()));
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

function updateClearAllBtn() {
  clearAllBtn.hidden = tasks.length === 0;
}

init();


