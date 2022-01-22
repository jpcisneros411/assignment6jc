$(document).ready(function () {

    //parsing weather info from local storage
    let locations = localStorage.getItem("locations");
    if (locations === null) {
        locations = [];
    } else {
        locations = JSON.parse(locations);
    }

    //display cities from search
    function showSearches() {

    let searchHistory = $("#searchHistory")
    searchHistory.empty();

    for (let i = 0; i < locations.length; i++) {

    let searchedCity = $("<li>").text(locations[i]);
    searchedCity.addClass("list-group-item");
    searchHistory.prepend(searchedCity);
    }
    }

    //API calls
    function weatherCall(location) {

    //key and query for Current Forecast
    let apiKey = "5da769541599ab501e9c7f4a00a1cecf";
    let searchQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + apiKey + "&units=imperial";

        //Current Forecast call
        $.ajax({
            url: searchQuery,
            method: "GET"
        }).then(function (response) {

            $("#city").text(response.name);
            $("#temp").html("Temperature " + response.main.temp + " &#176; F");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind").text("Wind Speed: " + response.wind.speed + " mph");


        //uv stuff call
        let uvCall = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon 

        console.log(uvCall)

        //uv data call
        $.ajax({
            url: uvCall,
            method: "GET"
        }).then(function (uv) {
            console.log(uv);

            $("#uvi").text("UV Index: " + uv.value);

            //UV Index colors
            console.log(uv.value);
            if (uv.value <= 2) {
                $("#uvi").addClass(".text-bold");
                $("#uvi").attr("style", "background-color: #00FF00");

            } else if (uv.value > 3 && uv.value <= 5) {
                $("#uvi").addClass(".text-bold");
                $("#uvi").attr("style", "background-color: #FFFF00");

            } else if (uv.value > 5 && uv.value <= 7) {
                $("#uvi").addClass(".text-bold");

                $("#uvi").attr("style", "background-color: #FFA500");

            } else if (uv.value > 7 && uv.value < 10) {
                $("#uvi").addClass(".text-bold");
                $("#uvi").attr("style", "background-color: #FF0000");

            } else if (uv.value > 11) {
                $("#uvi").addClass(".text-bold");
                $("#uvi").attr("style", "background-color: #FF00FF");
            }
        })

    })
        //week forecast collection
        let weekCall = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + apiKey + "&units=imperial";
        console.log(weekCall);

        //Get Forecast Call
        $.ajax({
            url: weekCall,
            method: "GET"
        }).then(function (week) {
            console.log(week);

            let list = week.list
            console.log(list);
            $("#forecast").empty()

        //day info loop
        for (let i = 0; i < list.length; i += 8) {

        let weatherCol = $("<div class='col text-center align-items-center'>");
        let dateSection = $("<h4 class='title'>").text(list[i].dt_txt.split(" ")[0]);
                
        let humiditySection = $("<p class='subtitle'>").text("Humidity: " + list[i].main.humidity + " %");
        let temperatureSection = $("<p class='subtitle'>").html("Temp: " + list[i].main.temp + " &#176; F");
                
        let image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + list[i].weather[0].icon + "@2x.png");

        weatherCol.append(dateSection);

        weatherCol.append(temperatureSection);
        weatherCol.append(humiditySection);

        weatherCol.append(image);

        $("#forecast").append(weatherCol);

        }
        })
    }

    //search city click event function
    $("#searchBtn").click(function() {
    let location = $("#searchInput").val();
    locations.push(location)
    weatherCall(location)

    //local storage 
    console.log(locations);
    localStorage.setItem("locations", JSON.stringify(locations));

    //display searches

    showSearches();

    }
    )

    //search history
    $(document).on("click", ".list-group-item", function(){
    let location = $(this).text()
    weatherCall(location)
    }
    )

    //searched cities

    showSearches();

}

);