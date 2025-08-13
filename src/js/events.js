import {
  taskForm,
  taskInput,
  editForm,
  editInput,
  cancelEditBtn,
  searchInput,
  eraseBtn,
  filterBtn,
} from "./domElements";

import {
  saveTodo,
  toggleForms,
  updateTodo,
  getSearchedTodos,
  filterTodos,
} from "./todoFunctions";

import {
  removeTodoLocalStorage,
  updateTodoStatusLocalStorage,
} from "./storage";

//Events
export function registerEvents() {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = taskInput.value;

    if (inputValue) {
      saveTodo(inputValue);
    }
  });

  document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h4")) {
      todoTitle = parentEl.querySelector("h4").innerText || "";
    }

    if (targetEl.classList.contains("finish-todo")) {
      parentEl.classList.toggle("done");
      updateTodoStatusLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("edit-todo")) {
      toggleForms();
      editInput.value = todoTitle;
      oldInputValue = todoTitle;
    }

    if (targetEl.classList.contains("remove-todo")) {
      parentEl.remove();
      removeTodoLocalStorage(todoTitle);
    }
  });

  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
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
  });
}
