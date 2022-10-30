const app = {
  appData: null,
  wheatherApiKey: "72f1e697d6e7311ea64d8c29f3c8330f",
  localStorageAvailable: false,
  tablePropeties: [
    "id",
    "firstName",
    "lastName",
    "capsule",
    "age",
    "city",
    "gender",
    "hobby",
    "",
  ],
  curSearchTerm: "firstName",
  curSearchValue: null,
  editMood: false,
};
const landingPage = document.querySelector(".landing-page");
const theClass = document.querySelector(".the-class");
const table = document.querySelector(".table-container");
const searchForm = document.querySelector("form-container");
const enterBtn = document.querySelector("#enter-class");

var rowsCounter = 0;
var searchCounter = 0;

const cityInEnglish = {
  netanya: "נתניה",
  aramsha: "עראמשה",
  "kiryat%shemona": "קרית שמונה",
  netanya: "נתניה",
  kseifa: "כסיפה",
  "Ein%Qiniyye": "עין קנייא",
  Tiberias: "טבריה",
  Hurfeish: "חורפש",
  ashdod: "אשדוד",
  netivot: "נתיבות",
  Beersheba: "באר שבע",
  Kedumim: "קדומים",
  jerusalem: "ירושלים",
  karmiel: "כרמיאל",
  "Rishon%LeZion": "ראשון לציון",
  "Peki'in": "פקיעין",
  Julis: "ג'וליס",
  "Petah%Tikva": "פתח תקווה",
  ako: "עכו",
  "Kafr%Qara": "כפר קרע",
  hedera: "חדרה",
};

//! -------------------aSync functions------------------

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("error");
  }
}

async function getAllGroupMembers() {
  try {
    let group1 = await fetchData(
      "https://capsules7.herokuapp.com/api/group/one"
    );
    let group2 = await fetchData(
      "https://capsules7.herokuapp.com/api/group/two"
    );
    const mergedArr = group1.concat(group2);
    mergedArr.sort((a, b) => a.id - b.id);
    let people = [];
    for (let i = 0; i < mergedArr.length; i++) {
      const person = fetchData(
        `https://capsules7.herokuapp.com/api/user/${mergedArr[i].id}`
      );
      people.push(person);
    }
    const data = await Promise.all(people);
    app.appData = [...data];
    //?ADD TO LOCAL STORAGE
    return data;
  } catch {
    console.log("group members are not available");
  }
}

//! -------------------draw table functions------------------

function createRow(member) {
  const row = document.createElement("div");
  row.classList.add("table-row");
  createCells(row, rowsCounter, member);
  table.appendChild(row);
  rowsCounter++;
}

function createCells(row, rowsCounter, member) {
  let cellCounter = 0;
  for (let prop of app.tablePropeties) {
    let newCell = document.createElement("div");
    newCell.classList.add("table-cell");
    newCell.setAttribute("data-prop", `${prop}`);
    if (rowsCounter === 0) {
      //case of first row
      newCell.textContent = `${prop}`;
    } else {
      row.classList.add(`id${member.id}`);
      if (cellCounter === 8) {
        newCell.classList.add("buttons-container");
        insertEditButtons(newCell);
      } else {
        if (cellCounter === 5) {
          newCell.classList.add(`${prop}`);
        }
        newCell.textContent = member[prop];
      }
    }
    cellCounter++;
    row.appendChild(newCell);
  }
}

function insertEditButtons(cell) {
  const deleteStudent = document.createElement("button");
  deleteStudent.classList.add("delete-btn");
  deleteStudent.innerHTML = "&#10007;";
  const editStudent = document.createElement("button");
  editStudent.classList.add("edit-btn");
  editStudent.innerHTML = "&#9998;";
  cell.appendChild(editStudent);
  cell.appendChild(deleteStudent);
}

//! -------------------EVENTS functions------------------

function addEventsToButtons() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const editButtons = document.querySelectorAll(".edit-btn");

  document.addEventListener("keydown", handleEnterEvents);
  deleteButtons.forEach((b) => {
    b.addEventListener("click", deleteStudent);
  });
  editButtons.forEach((b) => {
    b.addEventListener("click", editStudent);
  });
}

function handleEnterEvents(e) {
  if (e.key == "Enter") {
    e.preventDefault();
  }
}

function addHoverEvents() {
  console.log("hi");
  const cityCells = document.querySelectorAll(".city");
  cityCells.forEach((cell) => {
    cell.addEventListener("mouseover", (e) => {
      displayCityWeather(e.target.innerHTML, e.target);
    });
  });
}

//! -------------------delete and edit functions------------------

function deleteStudent(e) {
  const studentToRemove = e.path[2];
  if (
    confirm("Are you sure you want to delete student? all data will be lost")
  ) {
    studentToRemove.classList.add("hidden");
  }
}

function editStudent(e) {
  e.target.classList.add("edit");
  e.target.innerHTML = "&check;";
  const rowCells = e.path[2].children;
  if (!app.editMood) {
    app.editMood = true;
    for (let i = 0; i < rowCells.length; i++) {
      if (i == 0 || i == 6 || i == 8) {
        rowCells[i].contentEditable = "false";
      } else {
        rowCells[i].contentEditable = "true";
      }
    }
  } else {
    for (let i = 0; i < rowCells.length; i++) {
      rowCells[i].contentEditable = "false";
    }
    e.target.classList.remove("edit");
    e.target.innerHTML = "&#9998;";
    app.editMood = false;
    console.log("saved");
  }
}

//! -------------------hover events------------------

//! -------------------seraching student functions------------------

function addInputEvents() {
  document.addEventListener("keydown", handleBackSpace);
  const searchCategory = document.querySelector("select");
  const searchBar = document.getElementById("search-input");
  searchCategory.addEventListener("change", setSearchTerm);
  searchBar.addEventListener("input", searchForMatches);
  enterBtn.addEventListener("click", enterClass);
}
function enterClass() {
  landingPage.classList.add("hidden");
  theClass.classList.remove("hidden");
}

function handleBackSpace(e) {
  if (e.key === "Backspace") {
    if (app.curSearchValue == "") {
      const allStudents = table.children;
      for (row of allStudents) {
        row.classList.remove("hidden");
      }
    }
  }
}
function setSearchTerm(e) {
  app.curSearchTerm = e.target.value;
}

function removeUnMatched(unMatches, matches) {
  for (member of unMatches) {
    const toRemove = document.querySelector(`.id${member}`);
    toRemove.classList.add("hidden");
  }
  for (member of matches) {
    const toRemove = document.querySelector(`.id${member}`);
    toRemove.classList.remove("hidden");
  }
}

function searchForMatches(e) {
  app.curSearchValue = e.target.value;
  if (searchCounter > 0) {
    if ((app.curSearchValue = "")) {
      const allStudents = table.children;
      for (row of allStudents) {
        row.classList.remove("hidden");
      }
    }
  }
  var unMatches = [];
  var matches = [];
  for (let i = 0; i < app.appData.length; i++) {
    const student = app.appData[i];
    for (let prop in student) {
      if (student[app.curSearchTerm] != e.target.value) {
        unMatches.push(student.id);
      } else {
        matches.push(student.id);
      }
    }
  }
  removeUnMatched(unMatches, matches);
  searchCounter++;
}

//! -------------------APP starts here!------------------
isLocalStorageAvailable();
displayApp();
displayData();
console.log("APP UPLOADED SUCCESFULLY");

function displayApp() {
  createRow();
  addInputEvents();
}

async function displayData() {
  try {
    const classObj = await getAllGroupMembers();
    classObj.forEach((member) => {
      createRow(member);
    });
    addEventsToButtons();
    addHoverEvents();
  } catch {
    console.log("error");
  }
}

//! -------------------wheather functions -------------------

async function getCityCoordinates(cityName) {
  try {
    const cityData = await fetchData(
      `HTTPS://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${app.wheatherApiKey}`
    );
    const lat = cityData[0].lat.toFixed(2);
    const lon = cityData[0].lon.toFixed(2);
    const coors = await fetchWeather(lat, lon);
    return coors;
  } catch {
    console.log("e");
  }
}

async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(
      `HTTPS://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${app.wheatherApiKey}`
    );
    if (!res.ok) {
      return;
    }
    const cityWeather = await res.json();
    console.log(cityWeather);
    const tempNow = cityWeather.main.temp;
    const tempFeelsLike = cityWeather.main.feels_like;
    let weatherData = { now: tempNow, feels: tempFeelsLike };
    return weatherData;
  } catch {
    console.log("e");
  }
}
async function displayCityWeather(cityName, location) {
  try {
    let city;
    for (prop in cityInEnglish) {
      if (cityInEnglish[prop] == cityName) {
        city = prop;
      }
    }
    const currentWeather = await getCityCoordinates(city);
    await popWeather(currentWeather, location);
  } catch {
    console.log("error ");
  }
}

async function popWeather(weather, location) {
  try {
    const weatherWindow = document.createElement("div");
    weatherWindow.classList.add("weather-window");
    console.log("wethar now f:" + weather.now);
    let nowC = ((273 - weather.now) * -1).toFixed(0);
    let feelsF = ((273 - weather.feels) * -1).toFixed(0);
    weatherWindow.innerHTML = `&#9728; &#9729; <br> Now: ${nowC}&#8451; <br> Feels like: ${feelsF}&#8451;`;
    location.before(weatherWindow);
    setTimeout(() => {
      weatherWindow.remove();
    }, 3000);
  } catch {
    console.log("e");
  }
}

//! -------------------local storage functuons -  tested !-------------------

// function that detects whether localStorage is both supported and available:
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    console.log("e");
  }
}

function isLocalStorageAvailable() {
  if (storageAvailable("localStorage")) {
    app.localStorageAvailable = true;
    console.log("local storage is available");
  } else {
    console.log("storage isnt available!!");
  }
}
