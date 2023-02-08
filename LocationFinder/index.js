// Global variables
var map; // map object
let loc = new Object(); // current location
var markers = []; // array of markers
var distancesToCurrentLocations = []; // array of distances
var currentAddresses = []; // array of addresses
var currentRatings = []; // array of ratings

// DOM elements
const zipCodeField = document.getElementById("zip-code");
const soccerButton = document.getElementById("soccer-btn");
const basketballButton = document.getElementById("basketball-btn");
const iceHockeyButton = document.getElementById("ice-hockey-btn");
const tennisButton = document.getElementById("tennis-btn");
const baseballButton = document.getElementById("baseball-btn");
const golfButton = document.getElementById("golf-btn");

const locationCardContainer = document.getElementById("location-card-container");

const signUpButton = document.getElementById("sign-up-btn");
const signUpForm = document.getElementById("sign-up-form");
const signUpFormCloseButton = document.getElementById("sign-up-form-close-btn");

const themeButton = document.getElementById("theme-btn");

function initMap() {
    console.log("initializing map")

    options = {
        center: { lat: 42.3501, lng: -71.0589 },
        zoom: 14,
        mapTypeId: "hybrid",
        // add styles to make the map look better and dark mode, removing the buttons and labels
        styles: [{
            "elementType": "geometry",
            "stylers": [{
                "color": "#242f3e"
            }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#746855"
            }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#242f3e"
            }]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#d59563"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#d59563"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#263c3f"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{

                "color": "#6b9a76"
            }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
                "color": "#38414e"
            }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#212a37"
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#9ca5b3"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "color": "#746855"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#1f2835"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{

                "color": "#f3d19c"
            }]
        },

        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#2f3948"
            }]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#d59563"
            }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#17263c"
            }]
        },
        {

            "featureType": "water",

            "elementType": "labels.text.fill",

            "stylers": [{
                "color": "#515c6d"
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#17263c"
            }]
        }]
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        loc.lat = position.coords.latitude;
        loc.lng = position.coords.longitude;
        options.center = loc;
        map = new google.maps.Map(document.getElementById("map"), options);
    });
}

// Event listeners
basketballButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "basketball court", "images/basketball.png");
});
soccerButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "soccer pitch", "images/soccer-ball.png");
});
iceHockeyButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "hockey rink", "images/ice-hockey.png");    
});
tennisButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "tennis court", "images/tennis.png");
});
baseballButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "baseball field", "images/baseball.png");
});
golfButton.addEventListener("click", function () {
    clearMarkersAndDistances();
    clearLocationContainer();
    findNearbyLocationByString(loc, "golf course", "images/flag-in-hole.png");
});

zipCodeField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (zipCodeField.value.length < 5) {
            zipCodeField.classList.add("shake");
            setTimeout(function () {
                zipCodeField.classList.remove("shake");
            }, 1000);
            return;
        }
        clearMarkersAndDistances();
        updateUserLocationFromZipCode();
    }
});

signUpButton.addEventListener("click", function () {
    clearLocationContainer();
    console.log("sign up button clicked")
    // change the sign up form display from none
    signUpForm.style.display = "block";
});
signUpFormCloseButton.addEventListener("click", function () {
    signUpForm.style.display = "none";
});

themeButton.addEventListener("click", function () {
    if (themeButton.innerHTML === '<img src="images/moon_filled.png" alt="Moon" id="moon">') {
        themeButton.innerHTML = '<img src="images/moon.png" alt="Sun" id="sun">';
        // change the theme to light (change the class from theme-dark to theme-light)
        document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-light");
        return;
    }
    // if the theme is light, change it to dark
    themeButton.innerHTML = '<img src="images/moon_filled.png" alt="Moon" id="moon">';
    document.body.classList.remove("theme-light");
    document.body.classList.add("theme-dark");
});


// gets the lat and long of the zip code
function updateUserLocationFromZipCode() {
    const zipCode = document.getElementById("zip-code").value;

    // get the lat and long of the zip code
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+zipCode+'&key=AIzaSyCL4yOwkB5e1w8KXeQ3ZanLVQCDYUYaSeI')
        .then(response => response.json())
        .then(data => {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            panToCenter(data.results[0].geometry.location)
            // map.panTo(new google.maps.LatLng(lat, lng));
            map.setZoom(14);
            // update the global location variable
            loc.lat = lat;
            loc.lng = lng;
            return;
        })
        .catch(error => {
            console.log("failed to get coordinates at " + zipCode + "")
            // if the zip code is invalid shake the zip code field
            zipCodeField.classList.add("shake");
            setTimeout(function () {
                zipCodeField.classList.remove("shake");
            }, 1000);
        });
}

// clears the markers and the distances to the current locations
function clearMarkersAndDistances() {
    if (markers == null) {
        return;
    }
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    distancesToCurrentLocations = [];
    markers = [];
    currentAddresses = [];
    currentRatings = [];
}

// finds nearby locations by a query (given a location and an icon as well)
function findNearbyLocationByString(location, query, icon) {
    var pyrmont = new google.maps.LatLng(location.lat, location.lng);
    var request = {
        location: pyrmont,
        radius: '10000',
        keyword: query
    };

    services = new google.maps.places.PlacesService(map);
    services.nearbySearch(request, callback);
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.sort(function (a, b) {
                var latA = a.geometry.location.lat();
                var lonA = a.geometry.location.lng();
                var latB = b.geometry.location.lat();
                var lonB = b.geometry.location.lng();
                var lat2 = location.lat;
                var lon2 = location.lng;
                Number.prototype.toRad = function() {
                    return this * Math.PI / 180;
                }

                var R = 6371; // km 
                //has a problem with the .toRad() method below.
                var x1A = lat2-latA;
                var dLatA = x1A.toRad();  
                var x2A = lon2-lonA;
                var dLonA = x2A.toRad();  
                var aA = Math.sin(dLatA/2) * Math.sin(dLatA/2) + 
                                Math.cos(latA.toRad()) * Math.cos(lat2.toRad()) * 
                                Math.sin(dLonA/2) * Math.sin(dLonA/2);  
                var c = 2 * Math.atan2(Math.sqrt(aA), Math.sqrt(1-aA)); 
                var dA = R * c; 

                var x1B = lat2-latB;
                var dLatB = x1B.toRad();
                var x2B = lon2-lonB;
                var dLonB = x2B.toRad();
                var aB = Math.sin(dLatB/2) * Math.sin(dLatB/2) +
                                Math.cos(latB.toRad()) * Math.cos(lat2.toRad()) *
                                Math.sin(dLonB/2) * Math.sin(dLonB/2);
                var c = 2 * Math.atan2(Math.sqrt(aB), Math.sqrt(1-aB));
                var dB = R * c;

                return dA - dB;
            });

            for (var i = 0; i < results.length; i++) {
                var lat1 = results[i].geometry.location.lat();
                var lon1 = results[i].geometry.location.lng();
                var lat2 = location.lat;
                var lon2 = location.lng;
                Number.prototype.toRad = function() {
                    return this * Math.PI / 180;
                }
                // distance between lat1, lon1 and lat2, lon2 in miles
                var R = 6371; // km
                var x1 = lat2-lat1;
                var dLat = x1.toRad();
                var x2 = lon2-lon1;
                var dLon = x2.toRad();
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                                Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                distancesToCurrentLocations.push(d * 0.621371);

                currentAddresses.push(results[i].vicinity);
                currentRatings.push(results[i].rating);
            }


            for (var i = 0; i < results.length; i++) {
                if (i == 0) {
                    panToCenter(results[i].geometry.location);
                }

            console.log(results[i])

                createMarker(results[i], icon, results[i].name);
            }

            loadLocationContainer();
        }
    }
}

function createMarker(place, icon, title) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: icon,
        title: title
    });

    markers.push(marker);
}

function setCenter(location) {
    map.setCenter(location);
}

function panToCenter(location) {
    map.panTo(location);
}

function clearLocationContainer() {
    locationCardContainer.innerHTML = "";

    var arrow = document.getElementsByClassName("arrow")[0];
    if (arrow) {
        document.body.removeChild(arrow);
    }
}

function swipeOutAnimationLocationContainer() {
    // add slide-right class to locationCardContainer
    locationCardContainer.classList.add("slide-right");

    var arrow = document.getElementsByClassName("arrow")[0];
    arrow.className = "arrow slide-right";

    // setTimeout(function() {
    //     // clearLocationContainer();
    //     locationCardContainer.className = "card-container";
    // }, 500);
}

function swipeInAnimationLocationContainer() {
    locationCardContainer.className = "card-container slide-in";
    var arrow = document.getElementsByClassName("arrow")[0];
    arrow.className = "arrow slide-in";

    setTimeout(function() {
        locationCardContainer.className = "card-container";
        arrow.className = "arrow";
    }, 500);
}

function loadLocationContainer() {
    // check if locationCardContainer is empty
    var emptyContainer = false;
    if (locationCardContainer.innerHTML == "") {
        emptyContainer = true;
    }

    var arrow = document.createElement("div");
    arrow.className = "arrow";
    arrow.innerHTML = "<div class='arrow-top'></div><div class='arrow-bottom'></div>";
    arrow.addEventListener("click", function() {
        swipeOutAnimationLocationContainer();
    });
    document.body.appendChild(arrow);


    for (var i = 0; i < markers.length; i++) {
        var distanceToLocation = distancesToCurrentLocations[i];
        // round the distance to the nearest tenth
        distanceToLocation = Math.round(distanceToLocation * 10) / 10;
        var locationName = markers[i].title;
        var locationAddress = currentAddresses[i];
        var locationRating = currentRatings[i];

        // create a new div element
        var locationCard = document.createElement("div");
        locationCard.className = "card";
        locationCard.id = "locationCard" + i;
        locationCard.innerHTML = "<div class='location-card-header'> <h3 class='location-card-title'>" + locationName + "</h3> <p class='location-card-address'>" + locationAddress + "</p> </div> <div class='location-card-body'> <p class='location-card-distance'>" + distanceToLocation + "Miles</p> <p class='location-card-rating'>Rating: " + locationRating + "</p> </div> <div class='location-card-footer'><a href=" + "'https://www.google.com/maps/place/" + locationAddress + "'><button class='location-card-directions-btn'><img class='location-card-direction-icon' src='images/up-right-arrow.png' alt='Directions'></button></a></div> ";
        // append this card to the locationCardContainer
        locationCardContainer.appendChild(locationCard);
    }

    if (!emptyContainer) {
        swipeOutAnimationLocationContainer();
        setTimeout(function() {
            swipeInAnimationLocationContainer();
        }
        , 500);
    } else {
        swipeInAnimationLocationContainer();
    }
    

    // add event listeners to the location cards that will pan to the location when clicked
    for (var i = 0; i < markers.length; i++) {
        var locationCard = document.getElementById("locationCard" + i);
        locationCard.addEventListener("click", function() {
            var index = this.id.substring(12);
            var location = markers[index].position;
            panToCenter(location);
        });
    }
}