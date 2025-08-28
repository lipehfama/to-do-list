import { displayCurrentDate } from "./date";
import { loadTodos } from "./storage";
import { registerEvents } from "./events";

function initApp() {
  displayCurrentDate();

  loadTodos();

  registerEvents();
}

initApp();
