let workouts = JSON.parse(localStorage.getItem("fitpace_workouts")) || [];

const workoutForm = document.getElementById("workout-form");
const workoutList = document.getElementById("workout-list");
const totalDistanceEl = document.getElementById("total-distance");
const totalWorkoutsEl = document.getElementById("total-workouts");
const totalCaloriesEl = document.getElementById("total-calories");

// Estimate calories burned based on type and duration
function calculateCalories(type, durationMins, distanceKm, intensity=1.0) {
  let burnRate = 8 * intensity; // calories per minute default
  if (type === "Running") burnRate = 11.5;
  if (type === "Cycling") burnRate = 9.0;
  if (type === "Gym") burnRate = 6.5;
  if (type === "Walking") burnRate = 4.5;
  return Math.round(durationMins * burnRate);
}

function renderDashboard() {
  workoutList.innerHTML = "";
  let totalDistance = 0;
  let totalCalories = 0;

  workouts.forEach((item, index) => {
    const calories = calculateCalories(item.type, item.duration, item.distance);
    totalDistance += Number(item.distance);
    totalCalories += calories;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${item.title}</strong></td>
      <td>${item.type}</td>
      <td>${item.distance} km</td>
      <td>${item.duration} mins</td>
      <td>${calories} kcal</td>
      <td><button class="delete-btn" onclick="removeWorkout(${index})">Delete</button></td>
    `;
    workoutList.appendChild(row);
  });

  totalDistanceEl.textContent = totalDistance.toFixed(1);
  totalWorkoutsEl.textContent = workouts.length;
  totalCaloriesEl.textContent = totalCalories;

  localStorage.setItem("fitpace_workouts", JSON.stringify(workouts));
}

workoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("workout-title").value.trim();
  const type = document.getElementById("workout-type").value;
  const distance = Number(document.getElementById("workout-distance").value);
  const duration = Number(document.getElementById("workout-duration").value);

  if (title && duration > 0) {
    workouts.push({ title, type, distance, duration });
    workoutForm.reset();
    renderDashboard();
  }
});

function removeWorkout(index) {
  workouts.splice(index, 1);
  renderDashboard();
}

// Initial render on page load
renderDashboard();