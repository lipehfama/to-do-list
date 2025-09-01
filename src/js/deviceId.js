/*
Generate a unique device identifier that persists across sessions
This creates a unique ID per browser/device without requiring login
*/
const DEVICE_ID_KEY = "device_id";

//Generate a unique device ID
function generateDeviceId() {
  //Create a unique ID using timestamp + random string
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 10);
  const browserInfo = navigator.userAgent
    .slice(-20)
    .replace(/[^a-zA-Z0-9]/g, "");

  return `device_${timestamp}_${randomString}_${browserInfo}`.substring(0, 50);
}

//Get or create the device ID
export function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if(!deviceId) {
        deviceId = generateDeviceId();

    }
}