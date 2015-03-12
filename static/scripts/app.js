define(['./map', './utils', './requests', './dom', './prepositions'], function (map, utils, requests, dom, prepositions) {
    var fetch = function () {
        var query = dom.input.value.split(' ');
        var whatWhere = prepositions.query(query);
        var what = whatWhere.what;
        var where = whatWhere.where;
        // don't want to make a bad query
        if (what && where) {
            // geocodes the where, then executes callbacks
            utils.codeAddress(where, function (googResponse) {
                requests.get('http://coresearch.citymaps.com/search/' + what, {
                    lat: googResponse[0].geometry.location.k,
                    lon: googResponse[0].geometry.location.D
                }, function (response) {
                    dom.deleteList();
                    dom.listDOM(response);
                    if (response.items.length === 0) {
                        window.alert('There were no results, please try again');
                    }
                    for (var m = 0; m < map.markers.length; m++) {
                        map.markers[m].setMap(null);
                    }
                    map.markers = [];
                    for (var y = 0; y < response.items.length; y++) {
                        var item = response.items[y];
                        var latLng = new google.maps.LatLng(item.lat, item.lon);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            title: item.name,
                            map: map.map,
                            animation: google.maps.Animation.DROP
                        });
                        map.markers.push(marker);
                    }
                }, function (err) {
                    window.alert('There was an error with the citymaps API, please try again', err);
                });
            });
        } else {
            window.alert('Please try rephrasing your query');
        }
    };
    //dom wireup
    dom.button.onclick = fetch;
});
