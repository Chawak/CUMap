var minZoomLevel = 15;
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: minZoomLevel,
    minzoom: 15,
    center: new google.maps.LatLng(13.738347, 100.532013),
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false
});
var strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(13.752632, 100.519820),
    new google.maps.LatLng(13.718237, 100.545179))
google.maps.event.addListener(map, 'zoom_changed', function () {
    if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
});
var searchBox = new google.maps.places.SearchBox(document.getElementById('places'));
map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('places'));
var an = new google.maps.places.SearchBox(document.getElementById('an'));
google.maps.event.addListener(searchBox, 'places_changed', function () {
    var check = 0;
    searchBox.set('map', null);
    var places = searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();
    var i, place;
    for (i = 0; place = places[i]; i++) {
        (function (place) {
            var marker = new google.maps.Marker({
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
    var x = document.getElementById("myDIV");
    x.style.display = "block";

});
function closecard() {
    var x = document.getElementById("myDIV");
    x.style.display = "none";
}

