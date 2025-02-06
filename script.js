const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container");
const serachForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoConatainer = document.querySelector(".user-info-conatainer");

//initially variable need???

let currentTab = userTab;
const API_KEY= [Your API Key];
currentTab.classList.add("current-tab");
getfromSessionStorage()

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!serachForm.classList.contains("active")) {
            userInfoConatainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            serachForm.classList.add("active");
        }
        else{
            serachForm.classList.remove("active");
            userInfoConatainer.classList.remove("active");
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});


//checked if cordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grantcontainer invisible 
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoConatainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //hw
    }
}

function renderWeatherInfo(weatherInfo){
    //we have to feath the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch value from weather Info object and put ni UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No GeoLocation Support Available");
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

serachForm.addEventListener("submit", (e) => {
    e.preventDefault();
    error.classList.remove("active");
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

const error = document.querySelector("[data-error]");

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoConatainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if(data?.cod == "404"){
            loadingScreen.classList.remove("active");
            error.classList.add("active");
        }
        else{
            error.classList.remove("active");
            loadingScreen.classList.remove("active");
            userInfoConatainer.classList.add("active");
            renderWeatherInfo(data);
        }
    }
    catch(err){
        alert("INTERNATE CONNETION ERROR...")
    }
}