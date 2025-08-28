import { taskForm, taskInput, taskList, editForm } from "./domElements";
import { saveTodoLocalStorage, updateTodoLocalStorage } from "./storage";

let oldInputValue;
//Functions
export const saveTodo = async (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h4");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.setAttribute("aria-label", "mark-task");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.setAttribute("aria-label", "edit-task");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.setAttribute("aria-label", "delete-task");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  taskList.appendChild(todo);

  if (save) {
    try {
      const id = await saveTodoLocalStorage({ text, done: 0 });
      // Store the Firestore document ID in the DOM element
      todo.setAttribute("data-id", id);
    } catch (error) {
      console.error("❌ Failed to save todo to Firestore:", error);
      // Remove from DOM if Firestore save failed
      todo.remove();
      throw error;
    }
  }

  taskInput.value = "";
};

export const toggleForms = () => {
  editForm.classList.toggle("hide");
  taskForm.classList.toggle("hide");
  taskList.classList.toggle("hide");
};

export const updateTodo = async (text) => {
  const todos = document.querySelectorAll(".todo");

  for (const todo of todos) {
    let todoTitle = todo.querySelector("h4");

    if (todoTitle.innerText === oldInputValue) {
      try {
        // Update in Firestore first
        await updateTodoLocalStorage(oldInputValue, text);

        // Then update in DOM
        todoTitle.innerText = text;
        console.log("✅ Todo updated successfully");
        break;
      } catch (error) {
        console.error("❌ Failed to update todo:", error);
        // Keep original text if update failed
        break;
      }
    }
  }
};

export const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h4").innerText.toLowerCase();

    todo.style.display = "flex";
    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

export const filterTodos = (filterValue) => {
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

export const setOldInputValue = (value) => {
  oldInputValue = value;
};
