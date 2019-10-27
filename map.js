var minZoomLevel = 15;
var places;
var marker;
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(13.738347, 100.532013),
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false
});
var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
});
var directionsService = new google.maps.DirectionsService;

var strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(13.752632, 100.519820),
    new google.maps.LatLng(13.718237, 100.545179))
google.maps.event.addListener(map, 'zoom_changed', function () {
    if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
});
var searchBox = new google.maps.places.SearchBox(document.getElementById('places'));

var input2 = document.getElementById('destination');
var endsearch = new google.maps.places.SearchBox(input2);
// create directions renderer and bind it to map
google.maps.event.addListener(searchBox, 'places_changed', function () {
    emptydest();
    if (marker) {
        marker.setMap(null);
    }
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
    }
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });
    places = searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();
    var i, place;
    for (i = 0; place = places[i]; i++) {
        (function (place) {
            marker = new google.maps.Marker({
                position: place.geometry.location
            });
            marker.bindTo('map', searchBox, 'map');
            google.maps.event.addListener(marker, 'map_changed', function () {
                if (!this.getMap()) {
                    this.unbindAll();
                }
            });
            bounds.extend(place.geometry.location);
        }(place));

    }
    map.fitBounds(bounds);
    searchBox.set('map', map);
    map.setZoom(17);
    closedatacard();
    closedirectcard();
    opennorm();
});
function closenormcard() {
    var x = document.getElementById("normal");
    x.style.display = "none";
}
function closenormcard2() {
    var x = document.getElementById("normal");
    x.style.display = "none";
    if (marker) {
        marker.setMap(null);
    }
    emptysearch()
}
function closedirectcard() {
    var x = document.getElementById("direct");
    x.style.display = "none";
}
function closedirectcard2() {
    var x = document.getElementById("direct");
    x.style.display = "none";
    if (marker) {
        marker.setMap(null);
    }
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
    }
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });
    emptysearch()
}
function closedatacard() {
    var x = document.getElementById("data");
    x.style.display = "none";
}
function closedatacard2() {
    var x = document.getElementById("data");
    x.style.display = "none";
    emptysearch()
    if (marker) {
        marker.setMap(null);
    }
}
function opendirect() {
    closenormcard()
    var x = document.getElementById("direct");
    x.style.display = "block";
}
function opendata() {
    closenormcard()
    var x = document.getElementById("data");
    x.style.display = "block";
}
function opennorm() {
    closenormcard()
    var x = document.getElementById("normal");
    x.style.display = "block";
}
function openroute() {
    var x = document.getElementById("route");
    x.style.display = "block";
}
function emptydest() {
    document.getElementById('destination').value = '';
}
function emptysearch() {
    document.getElementById('places').value = '';
}
function emptystart() {
    document.getElementById('start').value = '';
}
// listen to and respond to address search
google.maps.event.addListener(endsearch, 'places_changed', function () {
    if (marker) {
        marker.setMap(null);
    }
    endsearch.set('map', null);
    var locations = endsearch.getPlaces();
    var locations2 = searchBox.getPlaces();
    var start = locations[0].place_id;
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(locations[0].geometry.location);
    var end = locations2[0].place_id;
    bounds.extend(locations2[0].geometry.location);
    map.fitBounds(bounds);
    calculateAndDisplayRoute(directionsDisplay, directionsService, map, start, end);
    openroute()
});
function calculateAndDisplayRoute(directionsDisplay, directionsService, map, start, end) {
    directionsService.route({
        origin: {
            placeId: start
        },
        destination: {
            placeId: end
        },
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
    directionsDisplay.setPanel(document.getElementById('route'));
}