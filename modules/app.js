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
const table = document.querySelector(".table-container");
const searchForm = document.querySelector("form-container");
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
    return data;
  } catch {
    console.log("group members are not available");
  }
}

//! -------------------draw table functions------------------

function createRow(member) {
  const row = document.createElement("div");
  row.classList.add("table-row");
  displayRow(row, rowsCounter, member);
  table.appendChild(row);
  rowsCounter++;
}

function displayRow(row, rowsCounter, member) {
  let cellCounter = 0;
  for (let prop of app.tablePropeties) {
    let newCell = document.createElement("div");
    newCell.classList.add("table-cell");
    newCell.setAttribute("data-prop", `${prop}`);
    if (rowsCounter === 0) {
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

  document.addEventListener("click", handleClickEvents);
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

function handleClickEvents(e) {
  if (e.target.classList.contains("city")) {
    const city = e.srcElement.innerHTML;
    const location = e.target;
    displayCityWeather(city, location);
  }
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
    console.log("clicked on edit");
    for (let i = 0; i < rowCells.length; i++) {
      console.log(rowCells[i]);
      if (i == 0 || i == 1 || i == 9 || i == 7) {
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

//! -------------------seraching student functions------------------

function addInputEvents() {
  const searchCategory = document.querySelector("select");
  const searchBar = document.getElementById("search-input");

  searchCategory.addEventListener("change", setSearchTerm);
  searchBar.addEventListener("input", searchForMatches);
  searchBar.addEventListener("focusin", () => {});
  searchBar.addEventListener("focusout", displayAllStudents);
}

function setSearchTerm(e) {
  app.curSearchTerm = e.target.value;
}

function displayAllStudents(e) {
  console.log("jd");
  if (app.curSearchValue == "") {
    const allStudents = table.children;
    for (row of allStudents) {
      row.classList.remove("hidden");
    }
  }
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
addEventsToButtons();
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
  } catch {
    console.log("error");
  }
}

//! -------------------wheather api functions -------------------

async function getCityCoordinates(cityName) {
  try {
    const cityData = await fetchData(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${app.wheatherApiKey}`
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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${app.wheatherApiKey}`
    );
    if (!res.ok) {
      return;
    }
    const cityWeather = await res.json();
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
    console.log(currentWeather);
    await popWeather(currentWeather, location);
  } catch {
    console.log("error ");
  }
}

async function popWeather(weather, location) {
  try {
    console.log(weather);
    const weatherWindow = document.createElement("div");
    weatherWindow.classList.add("weather-window");
    weatherWindow.innerHTML = `Now: ${weather.now}&#8457; <br> Feels like: ${weather.feels}&#8457;`;
    location.before(weatherWindow);
    setTimeout(() => {
      console.log("timput");
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
