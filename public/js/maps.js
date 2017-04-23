var map;
var markers = [];
var flightPath;

function initMap() {
    var location = {lat: 10.762639, lng: 106.682027};
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        mapTypeId: 'terrain'
    });

    flightPath = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    // var flightPlanCoordinates = [
    //     {lat: 10.876023, lng: 106.797432},
    //     {lat: 10.873101, lng: 106.808551},
    //     {lat: 10.849138, lng: 106.774050},
    //     {lat: 10.835429, lng: 106.765963},
    //     {lat: 10.826514, lng: 106.760813},
    //     {lat: 10.813425, lng: 106.756929},
    //     {lat: 10.800967, lng: 106.711900},
    //     {lat: 10.792306, lng: 106.699487},
    //     {lat: 10.790367, lng: 106.701440},
    //     {lat: 10.777762, lng: 106.687256},
    //     {lat: 10.774750, lng: 106.690469},
    //     {lat: 10.765528, lng: 106.681886},
    //     {lat: 10.762639, lng: 106.682027}
    // ];
    //
    // var flightPath = new google.maps.Polyline({
    //     path: flightPlanCoordinates,
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    // });
    //
    // flightPath.setMap(map);

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Trường Đại học Khoa học Tự nhiên'
    });
    markers.push(marker);

    map.addListener('click', function(e) {
        addMarker(e.latLng, map);
    });
}

function addMarker(latLng, map) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers.push(marker);
}

function clearMaker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}