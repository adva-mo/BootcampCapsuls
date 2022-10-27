// Api of specific student:
// https://capsules7.herokuapp.com/api/user/:id
// {"id":"021","gender":"female","firstName":"אדוה","lastName":"מוזס","hobby":"גלישה","age":31,"city":"פתח תקווה","capsule":4}

// Api of each group:
// can be: one / two
// https://capsules7.herokuapp.com/api/group/:number (edited)
// number ="one"
// [
//   { id: "011", firstName: "מירי", lastName: "פורמן" },
//   { id: "012", firstName: "מיכאל", lastName: "קונין" },
//   { id: "013", firstName: "מוחמד", lastName: "נאטשה" },
//   { id: "014", firstName: "מאיר", lastName: "יוסף כהן" },
//   { id: "015", firstName: "לידור", lastName: "אשוש" },
//   { id: "016", firstName: "יעל", lastName: "לניר" },
//   { id: "017", firstName: "יוסף", lastName: "פדול" },
//   { id: "018", firstName: "בן", lastName: "גרינולד" },
//   { id: "019", firstName: "באשיר", lastName: "טאריף" },
//   { id: "020", firstName: "אראל", lastName: "חגאג" },
//   { id: "021", firstName: "אדוה", lastName: "מוזס" },
// ];

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

// fetchData("https://capsules7.herokuapp.com/api/user/001");

//? local storage tests-------------------

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
//! add a function: addDataToLocalStorage(), will recieve an object, iterate it and store it to local storage
//! before addind, make sure if the key is already exist, if not, creat a new key, if its is, update the key,
//use of the function:
function ifLocalStorageAvailable() {
  if (storageAvailable("localStorage")) {
    // Yippee! We can use localStorage awesomeness
    console.log("item added to local storage");
  } else {
    console.log("item didnt add to local storage!!");
    // Too bad, no localStorage for us
  }
}
