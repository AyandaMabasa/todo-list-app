const addBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const dueInput = document.getElementById('due-date-input');
const priorityInput = document.getElementById('priority-input');
const clearBtn = document.getElementById('clear-all-btn');
const themeToggle = document.getElementById('theme-toggle');
const list = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  clearBtn.disabled = tasks.length === 0;
}

function render() {
  list.innerHTML = '';
  if (!tasks.length) {
    emptyState.style.display = 'block';
    clearBtn.disabled = true;
    return;
  }
  emptyState.style.display = 'none';
  tasks.forEach(task => {
    const li = document.createElement('li');

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = task.done;
    chk.addEventListener('change', () => {
      task.done = chk.checked;
      save();
      render();
    });

    const txt = document.createElement('span');
    txt.textContent = task.text;
    txt.className = 'task-text';
    if (task.done) txt.style.textDecoration = 'line-through';

    const pr = document.createElement('span');
    pr.textContent = task.priority;
    pr.className = 'priority';

    const dd = document.createElement('span');
    dd.textContent = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
    dd.className = 'due-date';

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'delete-btn';
    del.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
    });

    li.append(chk, txt, pr, dd, del);
    list.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    dueDate: dueInput.value,
    priority: priorityInput.value,
    done: false
  });
  taskInput.value = dueInput.value = '';
  priorityInput.value = 'medium';
  save();
  render();
});

clearBtn.addEventListener('click', () => {
  if (confirm('Clear all tasks?')) {
    tasks = [];
    save();
    render();
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

window.addEventListener('DOMContentLoaded', () => {
  const dark = localStorage.getItem('theme') === 'dark';
  if (dark) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light Mode';
  }
  render();
});



