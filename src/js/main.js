// ! DOM
const form = document.getElementById("form");
const taskName = document.getElementById("taskName");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("date");
const info = document.getElementById("info");
const tasks = document.getElementById("tasks");

// ! Globals

let taskList = [];
const currentDate = new Date();
const taskIsValid = {
  task: false,
  priority: false,
  date: false,
};

// * Element for Info
const taskInfo = document.createElement("P");

// ! Functions

const createTask = (task, priority, date) => {
  let item = {
    name: task,
    priority: priority,
    date: date,
  };
  taskList.push(item);
  return item;
};

const addTask = () => {
  localStorage.setItem("task", JSON.stringify(taskList));
  printTask();
};

const printTask = () => {
  tasks.innerHTML = "";

  taskList = JSON.parse(localStorage.getItem("task"));
  if (taskList === null) {
    taskList = [];
  } else {
    taskList.forEach((element) => {
      tasks.innerHTML += `
      <div class="task priority__${element.priority}">
        <p class="task__name">${element.name}</p>
          <div class="date-view">
            <div class="date-view__top">
              <p class="date-view__item">La fecha de finalización es:</p>
            </div>
            <div class="date-view__bottom">
              <p class="date-view__item" id="count"></p>
            </div>
          </div>
        <button class="delete-task" id="delete-task">
          <span class="material-icons">
            delete
          </span>
        </button>
      </div>
      `;
      countdown(element.date, "count", "La tarea esta fuera de tiempo");
      // ? No tengo ni idea de porqué solo se carga la cuenta atrás en un elemento.
    });
  }
};

const getRemainTime = (deadline) => {
  let now = new Date();
  let remainTime = (new Date(deadline) - now + 1000) / 1000;
  let remainSeconds = ("0" + Math.floor(remainTime % 60)).slice(-2);
  // ? Por si no se entiende, lo que sucede es que le sumo un 0 como string y con slice(-2) le digo que muestre solo los dos digitos empezando por la derecha. El 0 en string estará pero no se mostrará hasta que el valor de Math sea de 1 dígito.
  let remainMinutes = ("0" + Math.floor((remainTime / 60) % 60)).slice(-2);
  let remainHours = ("0" + Math.floor((remainTime / 3600) % 24)).slice(-2);
  let remainDays = Math.floor(remainTime / (3600 * 24));

  return {
    remainTime,
    remainSeconds,
    remainMinutes,
    remainHours,
    remainDays,
  };
};

const countdown = (deadline, elem, finalMessage) => {
  const el = document.getElementById(elem);
  const timerUpdate = setInterval(() => {
    let t = getRemainTime(deadline);
    el.innerHTML = `${t.remainDays}:${t.remainHours}:${t.remainMinutes}:${t.remainSeconds}`;

    if (t.remainTime <= 1) {
      clearInterval(timerUpdate);
      el.innerHTML = finalMessage;
    }
  }, 1000);
};

const deleteTask = (task) => {
  let indexTask;
  taskList.forEach((element, index) => {
    if (element.name === task) indexTask = index;
  });
  taskList.splice(indexTask, 1);
  addTask();
};

const validateTask = () => {
  const taskValues = Object.values(taskIsValid);
  const valid = taskValues.findIndex((value) => value === false);

  const fragment = document.createDocumentFragment();

  switch (valid) {
    case -1:
      taskInfo.classList.remove("incorrect-task");
      taskInfo.classList.add("correct-task");
      taskInfo.textContent = "Tarea Creada correctamente";
      fragment.append(taskInfo);
      setTimeout(() => {
        taskInfo.classList.remove("correct-task");
        taskInfo.classList.add("hidden");
      }, 3000);
      form.reset();
      break;
    case 0:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Necesita escribir un nombre a la tarea";
      fragment.append(taskInfo);
      break;
    case 1:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Seleccione prioridad";
      fragment.append(taskInfo);
      break;
    case 2:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Seleccione una fecha válida";
      fragment.append(taskInfo);
      break;

    default:
      break;
  }
  info.append(fragment);
};

// ! Events

taskName.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.value.trim().length > 0) taskIsValid.task = true;
  else taskIsValid.task = false;
});

taskPriority.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.checked === true) taskIsValid.priority = true;
  else taskIsValid.priority = false;
});

taskDate.addEventListener("change", (e) => {
  e.preventDefault();
  const date = new Date(e.target.value);
  if (date.getTime() > currentDate.getTime()) taskIsValid.date = true;
  else taskIsValid.date = false;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //* Locals
  let name = e.target.taskName.value;
  let priority = e.target.taskPriority.value;
  let date = e.target.taskDate.value;

  validateTask();
  // * Add task to localStore
  if (
    taskIsValid.task === true &&
    taskIsValid.priority === true &&
    taskIsValid.date === true
  ) {
    createTask(name, priority, date);
    // * Reset validation
    taskIsValid.task = false;
    taskIsValid.priority = false;
    taskIsValid.date = false;
  }
  addTask();
});

document.addEventListener("DOMCOntentLoaded", printTask());

tasks.addEventListener("click", (e) => {
  e.preventDefault();
  let taskNameForDelete = e.path[2].childNodes[1].innerText;

  if (e.target.innerText.trim() === "delete") {
    deleteTask(taskNameForDelete);
  }
});
