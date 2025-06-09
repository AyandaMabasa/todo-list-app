<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>To-Do List App</title>
  <link rel="stylesheet" href="styles.css" />
  <style>
    body {
      font-family: sans-serif;
      background-color: #f0f0f0;
      color: #333;
      transition: background-color 0.3s, color 0.3s;
    }

    body.dark-mode {
      background-color: #121212;
      color: #eee;
    }

    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 8px;
    }

    body.dark-mode .container {
      background: #1e1e1e;
    }

    .input-group input,
    .input-group select,
    .input-group button {
      margin-right: 0.5rem;
      padding: 0.5rem;
    }

    .task-item {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 6px;
      background-color: #e0e0e0;
    }

    body.dark-mode .task-item {
      background-color: #2a2a2a;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>To-Do List</h1>
    <button id="theme-toggle">Toggle Dark Mode</button>

    <div class="input-group">
      <input type="text" id="task-input" placeholder="Enter a task" />
      <input type="date" id="due-date-input" />
      <select id="priority-input">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button id="add-task-btn">Add Task</button>
    </div>

    <ul id="task-list"></ul>
  </div>

  <script>
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task-input");
    const dueDateInput = document.getElementById("due-date-input");
    const priorityInput = document.getElementById("priority-input");
    const taskList = document.getElementById("task-list");
    const themeToggle = document.getElementById("theme-toggle");

    addTaskBtn.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      const dueDate = dueDateInput.value;
      const priority = priorityInput.value;

      if (taskText === "") return;

      const taskItem = document.createElement("li");
      taskItem.className = "task-item";
      taskItem.textContent = `${taskText} (Priority: ${priority}${dueDate ? ", Due: " + dueDate : ""})`;

      taskList.appendChild(taskItem);
      taskInput.value = "";
      dueDateInput.value = "";
      priorityInput.value = "medium";
    });

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  </script>
</body>
</html>


