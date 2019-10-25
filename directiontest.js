var rawlatitude = 40.7127837;
var rawlongitude = -74.0059413;
var latitude = parseFloat(rawlatitude);
var longitude = parseFloat(rawlongitude);
var latlong = new google.maps.LatLng(latitude, longitude);

// instantiate directions service object
var directionsService = new google.maps.DirectionsService;
// create map
var minZoomLevel = 15;
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: minZoomLevel,
    minzoom: 15,
    center: new google.maps.LatLng(13.738347, 100.532013),
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false
});
// add marker
var marker = new google.maps.Marker({
    position: latlong,
    draggable: true,
    map: map
});
// put address search box into map
var input = document.getElementById('pac-input');
var startsearch = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

var input2 = document.getElementById('pac-input2');
var endsearch = new google.maps.places.SearchBox(input2);
map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input2);
// create directions renderer and bind it to map
var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
});
// listen to and respond to address search
var onChangeHandler = function () {
    var locations = startsearch.getPlaces();
    var locations2 = endsearch.getPlaces();

    var start = locations[0].place_id;
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(locations[0].geometry.location);
    var end = locations2[0].place_id;
    bounds.extend(locations2[0].geometry.location);

    map.fitBounds(bounds);
    calculateAndDisplayRoute(directionsDisplay, directionsService, map, start, end);
};
google.maps.event.addListener(endsearch, 'places_changed', onChangeHandler);
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
    directionsDisplay.setPanel(document.getElementById('right-panel'));
}