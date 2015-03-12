define(['async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'], function () {
    var geocoder = new google.maps.Geocoder();
    var markers = [];
    // initialize map
    var mapOptions = {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 14
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    return {
        geocoder: geocoder,
        map: map,
        markers: markers
    };
});
