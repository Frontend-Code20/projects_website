import countryName from './countries.js'

const searchFrom = document.getElementById('searchFrom');
const temp = document.getElementById('temp');
const feels = document.getElementById('feels');
const winds = document.getElementById('winds');
const humidity = document.getElementById('humidity');
const city = document.getElementById('city');
const country = document.getElementById('country');

const error = document.getElementById('error');

window.addEventListener('DOMContentLoaded', async () => {

    await getWeatherInfo("Karachi");
})

searchFrom.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formdata = new FormData(searchFrom);
    const searchValue = formdata.get('search');

    await getWeatherInfo(searchValue);

})

async function getWeatherInfo(search) {

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=bf196558a9e38930edeea45d38476ece&units=metric`

    const response = await fetch(api);
    const data = await response.json();
    console.log(data);

    if (data.cod === "404") {
        error.style.display = "block"
    } else {

        AddMap(data.coord.lon,data.coord.lat, data.main.temp)
        error.style.display = "none"
        city.textContent = data.name
        country.textContent = countryName[data.sys.country];

        temp.textContent = `${data.main.temp}°C`
        feels.textContent = `${data.main.feels_like}°C`
        winds.textContent = `${data.wind.speed}km/h`
        humidity.textContent = `${data.main.humidity}%`
    }

}


let map;

function AddMap(lon, lat, temp){
    console.log(temp);
    
    if(map){
        map.remove();
    }

    map = L.map('map').setView([lat, lon], 5);

    var circle = L.circle([lat, lon], {
        radius: 50000,
      }).addTo(map);
      
      circle.bindTooltip(`${temp}°C`, {
        permanent: true,
        direction: 'top',
        className: 'temp-tooltip'
      }).openTooltip();      
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}
