const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

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
  }
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove();
    const taskText = e.target.parentElement.textContent.replace("Delete", "").trim();
    
    // Remove task from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// Load tasks from localStorage when page loads
window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `${task} <button class="delete-btn">Delete</button>`;
    taskList.appendChild(li);
  });
};
