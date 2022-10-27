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

fetchData("https://capsules7.herokuapp.com/api/user/001");

// displayData();
