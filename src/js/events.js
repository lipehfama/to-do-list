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
  setOldInputValue,
} from "./todoFunctions";

import {
  removeTodoById,
  removeTodoLocalStorage,
  updateTodoStatusById,
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

  document.addEventListener("click", async (e) => {
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

      try {
        if (docId) {
          //Use ID-based update (more efficient)
          await updateTodoStatusById(docId, !wasDone);
        } else {
          //Fallback to text-based update

          await updateTodoStatusLocalStorage(todoTitle);
        }
      } catch (error) {
        //Revert DOM change if update fails
        parentEl.classList.toggle("done");
        console.error("❌ Failed to update todo status:", error);
        alert("Failed to update todo. Please try again.");
      }
    }

    if (targetEl.classList.contains("edit-todo")) {
      toggleForms();
      editInput.value = todoTitle;
      setOldInputValue(todoTitle);
    }

    if (targetEl.classList.contains("remove-todo")) {
      try {
        if (docId) {
          //Use ID-based deletion
          await removeTodoById(docId);
        } else {
          //Fallback to text-based deletion
          removeTodoLocalStorage(todoTitle);
        }
        parentEl.remove();
      } catch (error) {
        console.error("❌ Failed to delete todo:", error);
        alert("Failed to delete todo. Please try again.");
      }
    }
  });

  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editInputValue = editInput.value.trim();

    if (editInputValue) {
      try {
        await updateTodo(editInputValue);
        toggleForms();
      } catch (error) {
        console.error("❌ Failed to update todo:", error);
        alert("Failed to update todo. Please try again.");
      }
    }
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
