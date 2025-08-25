import { displayCurrentDate } from "./date";
import { loadTodos } from "./storage";
import { registerEvents } from "./events";
import { app } from "./firebase";




app

displayCurrentDate();

loadTodos();

registerEvents();
