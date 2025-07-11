if (typeof apiKey === "undefined") {
    alert("API key is missing. Please create a file named 'apikey.js' with your OpenWeatherMap API key.\n\nExample:\nconst apiKey = 'your_key_here';");
    document.body.innerHTML = `
        <div style="color: red; font-size: 18px; text-align: center; margin-top: 50px;">
            <p><strong>Missing API key!</strong></p>
            <p>Please add <code>apikey.js</code> file in your project root with your OpenWeatherMap key.</p>
        </div>
    `;
    throw new Error("Missing API key — create apikey.js");
}

const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInfo = document.getElementById("searchInfo");
const bgVideo = document.getElementById("bgVideo");

const conditionIcons = {
    Clear: "assets/sun.png",
    Clouds: "assets/cloud.png",
    Rain: "assets/rainy.png",
    Drizzle: "assets/rainy.png",
    Snow: "assets/snowy.png",
    Thunderstorm: "assets/rainy.png",
    Mist: "assets/cloud.png",
    Haze: "assets/windy1.png",
    Fog: "assets/windy1.png"
};
const conditionVideos = {
    Clear: "video/summer.mp4",
    Clouds: "video/cloudy.mp4",
    Rain: "video/rainy.mp4",
    Drizzle: "video/rainy.mp4",
    Snow: "video/winter.mp4",
    Thunderstorm: "video/rainy.mp4",
    Mist: "video/autumn.mp4",
    Haze: "video/autumn.mp4",
    Fog: "video/autumn.mp4"
};

function getFormattedDate() {
    const now = new Date();
    const day = now.toLocaleDateString("en-GB", { weekday: "long" });
    const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    return `${day}, ${date}`;
}

function showIntroVideo() {
    bgVideo.src = "video/intro1.mp4";
    bgVideo.load();
    bgVideo.play();
}

function showWeather(data) {
    console.log("Weather Data:", data);

    const temp = data.main.temp;
    const mainCondition = data.weather[0].main;
    const description = data.weather[0].description;

    const icon = conditionIcons[mainCondition] || "assets/cloud.png";
    const video = conditionVideos[mainCondition] || "video/cloudy.mp4";
    bgVideo.src = video;
    bgVideo.load();
    bgVideo.play();

    const fullDate = getFormattedDate();

    searchInfo.innerHTML = `
        <div>
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${fullDate}</p>
            <p>Temperature: ${temp}°C</p>
            <p>Condition: ${description}</p>
            <img src="${icon}" alt="${mainCondition}">
        </div>
    `;
}

searchBtn.addEventListener("click", () => {
    const city = searchBar.value.trim();

    if (city === "") {
        searchInfo.innerHTML = `<p style="color: orange;">Please enter a location</p>`;
        showIntroVideo();
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                searchInfo.innerHTML = `<p style="color: red;">City not found</p>`;
                showIntroVideo();
                return;
            }

            showWeather(data);
        })
        .catch(error => {
            console.log("Fetch Error:", error);
            searchInfo.innerHTML = `<p style="color: red;">Error fetching weather</p>`;
            showIntroVideo();
        });
});








