import { displayCurrentDate } from "./date";
import { loadTodos } from "./storage";
import { registerEvents } from "./events";

displayCurrentDate();

loadTodos();

registerEvents();
