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
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputValue = taskInput.value;

    if (inputValue) {
      try {
        await saveTodo(inputValue);
      } catch (error) {
        console.error("❌ Failed to save todo:", error);
        alert("Failed to save todo. Please try again.");
      }
    }
  });

  document.addEventListener("click",async (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;
    let docId;

    if (parentEl && parentEl.querySelector("h4")) {
      todoTitle = parentEl.querySelector("h4").innerText || "";
      docId = parentEl.getAttribute("data-doc-id");
    }

    if (targetEl.classList.contains("finish-todo")) {
      const wasDone = parentEl.classList.contains("done");

      //Update Dom immediately for better UX
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
