const app = {
  wheatherApiKey: "72f1e697d6e7311ea64d8c29f3c8330f",
  localStorageAvailable: false,
  gitUsers: { adva: "adva-mo", adva: "adva-mo", adva: "adva-mo" },
  gitKey: "some-key",
  tablePropeties: [
    "gitStudentName",
    "id",
    "Name",
    "Last Name",
    "City",
    "Gender",
    "Hobby",
    "edit",
  ],
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
    await transformData(data);
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
    console.log(results);
  } catch {
    console.log(e);
  }
}

//! -------------------draw table functions------------------

function drawPropRaw() {
  const propRaw = document.createElement("div");
  propRaw.classList.add("table-row");
  table.appendChild(propRaw);
  insert9divsToRow(propRaw, rowsCounter);
  rowsCounter++;
}

function insert9divsToRow(propRaw, rowsCounter) {
  let cellCounter = 0;
  for (let prop of app.tablePropeties) {
    let newCell = document.createElement("div");
    newCell.classList.add("table-cell", "flex");
    newCell.setAttribute("id", `${prop}`);
    if (rowsCounter === 0) {
      if (cellCounter === 0 || cellCounter === 7) {
        newCell.textContent = "";
      } else {
        newCell.textContent = `${prop}`;
      }
    }
    cellCounter++;
    propRaw.appendChild(newCell);
  }
}

drawPropRaw();
drawPropRaw();

//! -------------------APP starts here!------------------
// getAllGroupMembers();

//! functions for tests-------------------

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
// getCityCoordinates("mexico-city");

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
