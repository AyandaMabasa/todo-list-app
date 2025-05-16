const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all-btn");

// Function to update the Clear All button state
function updateClearAllBtn() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  clearAllBtn.disabled = tasks.length === 0;
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const li = document.createElement("li");
    li.innerHTML = `${taskText} <button class="delete-btn">Delete</button>`;
    taskList.appendChild(li);

    // Save task to localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = ""; // Clear input after adding
    updateClearAllBtn(); // Update button state
  }
});

// Delete task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskItem = e.target.parentElement;
    const taskText = taskItem.textContent.replace("Delete", "").trim();

    taskItem.remove();

    // Remove task from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateClearAllBtn(); // Update button state
  }
});

// Clear All tasks
clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateClearAllBtn(); // Disable the button after clearing
});

// Load tasks from localStorage when page loads
window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `${task} <button class="delete-btn">Delete</button>`;
    taskList.appendChild(li);
  });
  updateClearAllBtn(); // Set initial button state
};
