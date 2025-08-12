const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue;

//display current day and date 
const today = new Date();

const calendar = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

document.querySelector(".date").innerHTML = today.toLocaleString(
  "en-US",
  calendar
);

//Functions
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h4");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);
  
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({text, done: 0});
  }
  
  taskList.appendChild(todo);
  taskInput.value = "";
}

const toggleForms = () => {
  editForm.classList.toggle("hide");
  taskForm.classList.toggle("hide");
  taskList.classList.toggle("hide");
}

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h4");

    if(todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
}

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h4").innerText.toLowerCase();

    todo.style.display = "flex";
    console.log(todoTitle)
    
    if(!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
       todo.classList.contains("done")
        ? (todo.style.display = "flex")
        : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
       todo.classList.contains("done")
        ? (todo.style.display = "none")
        : (todo.style.display = "flex")
      );

      break;

    default:
     break;
  }
};

//Events
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = taskInput.value;

  if(inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if(parentEl && parentEl.querySelector("h4")) {
    todoTitle = parentEl.querySelector("h4").innerText || "";
  }

  if(targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle);
  }

  if(targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
 
  if(targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }
});

cancelEditBtn.addEventListener("click" , (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if(editInputValue){
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
})

//LocalStorage Data
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
}

const loadTodos = () => {
  const todos = getTodosLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  })
}

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.text != todoText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
  todo.text === todoText ? (todo.done = !todo.done) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
  todo.text === todoOldText ? (todo.text =  todoNewText) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();