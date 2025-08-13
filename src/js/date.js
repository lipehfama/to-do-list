//display current day and date
export function displayCurrentDate() {
  const today = new Date();

  const calendar = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  document.querySelector(".date").innerHTML = today.toLocaleString(
    "en-US",
    calendar
  );
}
