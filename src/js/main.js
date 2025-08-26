import { displayCurrentDate } from "./date";
import { loadTodos } from "./storage";
import { registerEvents } from "./events";
import { testFirestore } from "./firebase";

displayCurrentDate();

loadTodos();

registerEvents();

testFirestore();
