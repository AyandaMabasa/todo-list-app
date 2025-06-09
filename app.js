// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");
const container = document.querySelector(".container");

// Load saved tasks and theme from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

// Render tasks to the list
function renderTasks() {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = "<li>No tasks yet! Add one above.</li>";
    clearAllBtn.disabled = true;
    return;
  }
  clearAllBtn.disabled = false;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.text}</strong>
      <span>Due: ${task.dueDate || "N/A"}</span>
      <span>Priority: ${task.priority}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    text,
    dueDate: dueDateInput.value,
    priority: prioritySelect.value,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Medium";
  taskInput.focus();
}

// Delete a single task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Clear all tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode;
  if (darkMode) {
    container.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    container.classList.remove("dark");
    themeToggle.textContent = "Dark Mode";
  }
  localStorage.setItem("darkMode", darkMode);
}

// Initial setup
function init() {
  renderTasks();

  if (darkMode) {
    container.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    container.classList.remove("dark");
    themeToggle.textContent = "Dark Mode";
  }
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    deleteTask(index);
  }
});

clearAllBtn.addEventListener("click", clearAllTasks);
themeToggle.addEventListener("click", toggleDarkMode);

// Run on page load
init();

