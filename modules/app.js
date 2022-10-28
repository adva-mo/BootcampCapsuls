const app = {
  appData: null,
  wheatherApiKey: "72f1e697d6e7311ea64d8c29f3c8330f",
  localStorageAvailable: false,
  gitUsers: { adva: "adva-mo", adva: "adva-mo", adva: "adva-mo" },
  tablePropeties: [
    "gitStudentName",
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
  curSearchTerm: "name",
  editMood: false,
};
var rowsCounter = 0;
const table = document.querySelector(".table-container");

//! -------------------aSync functions------------------

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function getAllGroupMembers() {
  try {
    const group1 = fetchData("https://capsules7.herokuapp.com/api/group/one");
    const group2 = fetchData("https://capsules7.herokuapp.com/api/group/two");
    const myPromises = [group1, group2];
    const data = await Promise.all(myPromises);
    // console.log(data);
    const results = await transformData(data);
    await addGitData(results);
    // console.log("got all group members", results);
    return results;
  } catch {
    console.log("group members are not available");
  }
}

async function transformData(data) {
  try {
    const members = [...data[0], ...data[1]];
    const myPromises = [];
    for (let member of members) {
      const ID = member.id;
      const fullMember = fetchData(
        `https://capsules7.herokuapp.com/api/user/${ID}`
      );
      myPromises.push(fullMember);
    }
    const results = await Promise.all(myPromises);
    // console.log(results);
    app.appData = [...results];
    return results;
  } catch {
    console.log(e);
  }
}

async function addGitData(results) {
  try {
    const res = results;
    return results.map((e) => {
      e.gitStudentName = "1";
      e.id = `${e.id}`;
      // console.log(e.gitStudentName);
    });
  } catch {
    console.log("eroor");
  }
}
//! -------------------draw table functions------------------

function createRow(member) {
  const row = document.createElement("div");
  row.classList.add("table-row");
  table.appendChild(row);
  displayRow(row, rowsCounter, member);
  rowsCounter++;
}

function displayRow(row, rowsCounter, member) {
  let cellCounter = 0;
  for (let prop of app.tablePropeties) {
    let newCell = document.createElement("div");
    newCell.classList.add("table-cell");
    // newCell.setAttribute("class", `${prop}`);
    newCell.setAttribute("id", `${prop}`);
    // newCell.classList.add(`${prop}`);
    // newCell.setAttribute("data-prop", `${prop}`);
    if (rowsCounter === 0) {
      if (cellCounter === 0) {
        newCell.textContent = "";
      } else if (cellCounter === 9) {
        newCell.textContent = `${prop}`;
      } else {
        newCell.textContent = `${prop}`;
      }
    } else {
      row.classList.add(`id${member.id}`);
      // console.log(member.firstName);
      if (cellCounter === 9) {
        insertEditButtons(newCell);
      } else {
        // newCell.setAttribute("data-value", `${prop}`);
        newCell.textContent = member[prop];
      }
    }
    cellCounter++;
    row.appendChild(newCell);
  }
}

function insertEditButtons(cell) {
  const deleteStudent = document.createElement("button");
  deleteStudent.classList.add("delete-student");
  const editStudent = document.createElement("button");
  editStudent.classList.add("edit-student");
  cell.appendChild(deleteStudent);
  cell.appendChild(editStudent);
}

//! -------------------event listeners functions------------------

function addEventsToButtons() {
  document.body.addEventListener("click", (e) => console.log(e.target));
  const deleteButtons = document.querySelectorAll(".delete-student");
  const editButtons = document.querySelectorAll(".edit-student");

  deleteButtons.forEach((b) => {
    b.addEventListener("click", deleteStudent);
  });
  editButtons.forEach((b) => {
    b.addEventListener("click", editStudent);
  });
}

function deleteStudent(e) {
  const studentToRemove = e.path[2];
  if (
    confirm("Are you sure you want to delete student? all data will be lost")
  ) {
    studentToRemove.classList.add("hidden");
  }
}

function editStudent(e) {
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
    app.editMood = false;
    console.log("saved");
  }
}
//! -------------------seraching functions------------------

function addInputEvents() {
  const searchCategory = document.querySelector("select");
  searchCategory.addEventListener("change", setSearchTerm);
  const searchBar = document.getElementById("search-input");
  searchBar.addEventListener("input", searchForMatches);
  searchBar.addEventListener("focusin", () => {});
  searchBar.addEventListener("focusout", displayAllStudents);
}
function displayAllStudents(e) {
  e.target.value = "";
  const allStudents = table.children;
  for (row of allStudents) {
    row.classList.remove("hidden");
  }
}

function setSearchTerm(e) {
  app.curSearchTerm = e.target.value;
}

function searchForMatches(e) {
  console.log(e);
  var unMatches = [];
  var matches = [];
  for (let i = 0; i < app.appData.length; i++) {
    const student = app.appData[i];
    for (let prop in student) {
      if (student[prop] != e.target.value) {
        unMatches.push(student.id);
      } else {
        matches.push(student.id);
      }
    }
  }
  removeUnMatched(unMatches, matches);
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

//! -------------------tests------------------

// async function displayAvatars() {
//   // { 011: "adva-mo", 012: "adva-mo", 013: "adva-mo" }
//   try {
//     const myPromises = [];
//     for (prop in app.gitUsers) {
//       const avatar = fetchData(
//         `https://api.github.com/users/${app.gitUsers[prop]}`
//       );
//       myPromises.push(avatar);
//     }
//     const arrOfavatar = await Promise.all(myPromises);
//     for (val of)
//     console.log(arrOfavatar);
//   } catch {
//     console.log("eroor");
//   }
// }

//! -------------------APP starts here!------------------

displayApp();
displayData();

function displayApp() {
  createRow();
  addInputEvents();
}

async function displayData() {
  try {
    const classObj = await getAllGroupMembers();
    classObj.forEach((member, i) => {
      createRow(member);
      // here function thet retrieves avatars
    });
  } catch {
    console.log("error");
  }
  addEventsToButtons();
  console.log("APP UPLOADED SUCCESFULLY");
}

//! -------------------wheather api functions - tested !-------------------

async function getCityCoordinates(cityName) {
  try {
    const cityData = await fetchData(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${app.wheatherApiKey}`
    );
    const lat = cityData[0].lat.toFixed(2);
    const lon = cityData[0].lon.toFixed(2);
    await getCityWeather(lat, lon);
  } catch {
    console.log(e);
  }
}

async function getCityWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${app.wheatherApiKey}`
    );
    if (!res.ok) {
      return;
    }
    const cityWeather = await res.json();
    console.log(cityWeather.main);
  } catch {
    console.log(e);
  }
}
// getCityCoordinates("karmiel");

//! -------------------local storage functuons -  tested !-------------------
//? TODO
//? add a function: addDataToLocalStorage(), will recieve an object, iterate it and store it to local storage
//? before adding, make sure if the key is already exist, if not, creat a new key, if its is, update the key,

// function that detects whether localStorage is both supported and available:
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    console.log(storage);
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

//use of the function:
function ifLocalStorageAvailable() {
  if (storageAvailable("localStorage")) {
    app.localStorageAvailable = true;
    // Yippee! We can use localStorage awesomeness
  } else {
    console.log("item didnt add to local storage!!");
    // Too bad, no localStorage for us
  }
}
//! -------------------avatar git hub functions ------------------

// async function displayAvatars() {
//   // { 011: "adva-mo", 012: "adva-mo", 013: "adva-mo" }
//   try {
//     const myPromises = [];
//     for (prop in app.gitUsers) {
//       const avatar = fetchData(
//         `https://api.github.com/users/${app.gitUsers[prop]}`
//       );
//       myPromises.push(avatar);
//     }
//     const arrOfavatar = await Promise.all(myPromises);
//     for (val of)
//     console.log(arrOfavatar);
//   } catch {
//     console.log("eroor");
//   }
// }
