import { displayCurrentDate } from "./date";
import { loadTodos } from "./storage";
import { registerEvents } from "./events";
import { getDeviceIdInfo } from "./deviceId";

function initApp() {
  getDeviceIdInfo;

  displayCurrentDate();

  loadTodos();

  registerEvents();
}

initApp();
