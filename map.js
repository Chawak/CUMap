var places, infoWindow;
var marker, mode = "WALKING";
let firestore = firebase.firestore()
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: new google.maps.LatLng(13.738347, 100.532013),
  scrollwheel: true,
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControl: false
});
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer(
  {
    map: map
  }
);
var searchBox = new google.maps.places.SearchBox(document.getElementById('places'));
var input2 = document.getElementById('destination');
var endsearch = new google.maps.places.SearchBox(input2);
function $_GET(param) {
  var url_string = window.location.href
  var url = new URL(url_string);
  var c = url.searchParams.get(param);
  return c;
}
var S = $_GET('start');
var E = $_GET('end');
var P = $_GET('places');
function urlplace() {
  var request = {
    query: P,
    fields: ['name', 'geometry', 'photos', 'formatted_address']
  };
  if (P === null) {
    return;
  }

  var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
      marker = new google.maps.Marker({
        position: results[0].geometry.location
      });
      document.getElementById("code").innerHTML = "-";
      document.getElementById("faculty").innerHTML = "-";
      document.getElementById("content").innerHTML = "&emsp;" + "น่าจะไม่มีในฐานข้อมูลครับ";
      document.getElementById("floor").innerHTML = "-";
      firestore.collection("AAAA").where("Name", "==", results[0].name).get().then((snapshot) => {
        snapshot.forEach(doc => {
          document.getElementById("code").innerHTML = doc.data().Code;
          document.getElementById("faculty").innerHTML = doc.data().Faculty;
          document.getElementById("content").innerHTML = "&emsp;" + doc.data().Content;
          document.getElementById("floor").innerHTML = doc.data().Floor;
        });
      });
      document.getElementById("pname").innerHTML = results[0].name;
      document.getElementById("pname2").innerHTML = results[0].name;
      document.getElementById("addr2").innerHTML = results[0].formatted_address;
      var PT = results[0].photos;
      if (PT) {
        document.getElementById("pimg").src = PT[0].getUrl({ 'maxWidth': 1281, 'maxHeight': 721 });
        document.getElementById("pimg2").src = PT[0].getUrl({ 'maxWidth': 1281, 'maxHeight': 721 });
      }
      else {
        document.getElementById("pimg").src = "img_avatar2.jpg";
        document.getElementById("pimg2").src = "img_avatar2.jpg";
      }
      marker.bindTo('map', searchBox, 'map');
      google.maps.event.addListener(marker, 'map_changed', function () {
        if (!this.getMap()) {
          this.unbindAll();
        }
      });
    }
  });
  searchBox.set('map', map);
  map.setZoom(17);
  closedatacard();
  closedirectcard();
  opennorm();
}
function urldirec() {
  if (E === null) {
    return;
  }
  if (S === null) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        calculateAndDisplayRoute2(directionsService, directionsDisplay, pos, E, mode);
        directionsDisplay.setMap(map);
        opendirect();
        openroute();
        directionsDisplay.setPanel(document.getElementById('route'));
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    }
    else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  else {
    calculateAndDisplayRoute2(directionsService, directionsDisplay, S, E, mode);
    directionsDisplay.setMap(map);
    opendirect();
    openroute();
    directionsDisplay.setPanel(document.getElementById('route'));
  }
}
urlplace();
urldirec();
// create directions renderer and bind it to map
google.maps.event.addListener(searchBox, 'places_changed', function () {
  emptydest();
  var n;
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
      document.getElementById("pname").innerHTML = place.name;
      document.getElementById("pname2").innerHTML = place.name;
      document.getElementById("addr2").innerHTML = place.formatted_address;
      var PT = place.photos;
      if (PT) {
        document.getElementById("pimg").src = PT[0].getUrl({ 'maxWidth': 1281, 'maxHeight': 721 });
        document.getElementById("pimg2").src = PT[0].getUrl({ 'maxWidth': 1281, 'maxHeight': 721 });
      }
      else {
        document.getElementById("pimg").src = "img_avatar2.jpg";
        document.getElementById("pimg2").src = "img_avatar2.jpg";
      }
      n = place.name;
      marker.bindTo('map', searchBox, 'map');
      google.maps.event.addListener(marker, 'map_changed', function () {
        if (!this.getMap()) {
          this.unbindAll();
        }
      });
      bounds.extend(place.geometry.location);
    }(place));
  }
  var y = document.getElementById("showbtn");
  y.style.display = "none";
  var y2 = document.getElementById("showdatabtn");
  y2.style.display = "none";
  map.fitBounds(bounds);
  searchBox.set('map', map);
  map.setZoom(17);
  closedatacard();
  closedirectcard();
  opennorm();
  document.getElementById("code").innerHTML = "-";
  document.getElementById("faculty").innerHTML = "-";
  document.getElementById("content").innerHTML = "&emsp;" + "น่าจะไม่มีในฐานข้อมูลครับ";
  document.getElementById("floor").innerHTML = "-";
  firestore.collection("AAAA").where("Name", "==", n).get().then((snapshot) => {
    snapshot.forEach(doc => {
      document.getElementById("code").innerHTML = doc.data().Code;
      document.getElementById("faculty").innerHTML = doc.data().Faculty;
      document.getElementById("content").innerHTML = "&emsp;" + doc.data().Content;
      document.getElementById("floor").innerHTML = doc.data().Floor;
    });
  });
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
function minimizedata() {
  var x = document.getElementById("data");
  x.style.display = "none";
  var y = document.getElementById("showdatabtn");
  y.style.display = "block";
}
function maximizedata() {
  var x = document.getElementById("data");
  x.style.display = "block";
  var y = document.getElementById("showdatabtn");
  y.style.display = "none";
}
function minimize() {
  var x = document.getElementById("direct");
  x.style.display = "none";
  var y = document.getElementById("showbtn");
  y.style.display = "block";
}
function maximize() {
  var x = document.getElementById("direct");
  x.style.display = "block";
  var y = document.getElementById("showbtn");
  y.style.display = "none";
}
function closedirectcard() {
  var x = document.getElementById("direct");
  x.style.display = "none";
  var y = document.getElementById("route");
  y.style.display = "none";
}
function closedirectcard2() {
  var x = document.getElementById("direct");
  x.style.display = "none";
  var y = document.getElementById("route");
  y.style.display = "none";
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
function closelist() {
  var x = document.getElementById("list");
  x.style.display = "none";
}
function closedatacard2() {
  var x = document.getElementById("data");
  x.style.display = "none";
  emptysearch();
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
function openlist() {
  var x = document.getElementById("list");
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
function walk() {
  var W = document.getElementById('walking');
  W.style.display = 'block';
  var D = document.getElementById('driving');
  D.style.display = 'none';
  var T = document.getElementById('transit');
  T.style.display = 'none';
  mode = "WALKING"
}
function drive() {
  var W = document.getElementById('walking');
  W.style.display = 'none';
  var D = document.getElementById('driving');
  D.style.display = 'block';
  var T = document.getElementById('transit');
  T.style.display = 'none';
  mode = "DRIVING"
}
function transit() {
  var W = document.getElementById('walking');
  W.style.display = 'none';
  var D = document.getElementById('driving');
  D.style.display = 'none';
  var T = document.getElementById('transit');
  T.style.display = 'block';
  mode = "TRANSIT"
}
// listen to and respond to address search
google.maps.event.addListener(endsearch, 'places_changed', function () {
  if (marker) {
    marker.setMap(null);
  }
  endsearch.set('map', null);
  if (directionsDisplay) {
    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
  }
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
  var locations = endsearch.getPlaces();
  var locations2 = searchBox.getPlaces();
  var start = locations[0].place_id;
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(locations[0].geometry.location);
  var end = locations2[0].place_id;
  bounds.extend(locations2[0].geometry.location);
  map.fitBounds(bounds);
  calculateAndDisplayRoute(directionsDisplay, directionsService, map, start, end, mode);
  openroute();
});
function calculateAndDisplayRoute(directionsDisplay, directionsService, map, start, end, mode) {
  directionsService.route({
    origin: {
      placeId: start
    },
    destination: {
      placeId: end
    },
    travelMode: mode
  }, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    else {
      window.alert('หาไม่เจออ่าค้าบบบ มีปัญหาอ่ะไรสักอย่างแหละ');
    }
  });
  directionsDisplay.setPanel(document.getElementById('route'));
}
function searchbygeo() {
  if (marker) {
    marker.setMap(null);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var locations2 = searchBox.getPlaces();
      var end = locations2[0].name;
      if (directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
      }
      directionsDisplay = new google.maps.DirectionsRenderer();
      calculateAndDisplayRoute2(directionsService, directionsDisplay, pos, end, mode);
      directionsDisplay.setMap(map);
      openroute();
      directionsDisplay.setPanel(document.getElementById('route'));
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function calculateAndDisplayRoute2(directionsService, directionsDisplay, start, end, mode) {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: mode
    },
    function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('หาไม่เจออ่าค้าบบบ มีปัญหาอ่ะไรสักอย่างแหละ');
      }
    });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

