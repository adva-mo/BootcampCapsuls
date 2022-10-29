const wheatherApiKey = "72f1e697d6e7311ea64d8c29f3c8330f";

async function getCityCoordinates(cityName) {
  try {
    const cityData = await fetchData(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${wheatherApiKey}`
    );
    const lat = cityData[0].lat.toFixed(2);
    const lon = cityData[0].lon.toFixed(2);
    await getCityWeather(lat, lon);
  } catch {
    console.log("e");
  }
}

async function getCityWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${wheatherApiKey}`
    );
    if (!res.ok) {
      return;
    }
    const cityWeather = await res.json();
    console.log(cityWeather.main);
  } catch {
    console.log("e");
  }
}
getCityCoordinates("jerusalem");
