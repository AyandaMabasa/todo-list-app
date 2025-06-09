const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const taskList = document.getElementById("task-list");

let tasks = [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.text} - Due: ${task.dueDate || "N/A"} - Priority: ${task.priority}`;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task.");

  const newTask = {
    text,
    dueDate: dueDateInput.value,
    priority: prioritySelect.value
  };

  tasks.push(newTask);
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Medium";
  taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});


