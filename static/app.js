(function () {
    window.onload = function () {
        // init vars
        var input = document.getElementsByTagName('input')[0];
        var button = document.getElementById('the-button');
        var form = document.getElementById('the-form');
        form.onsubmit = function () {
            return false;
        };
        var predicates = ['near', 'around', 'by', 'at', 'in', 'above', 'below'];
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
        // utils
        var codeAddress = function (address, callback) {
            geocoder.geocode({
                'address': address
            }, function (results) {
                map.setCenter(results[0].geometry.location);
                callback(results);
            });
        };
        // request helper
        var request = function () {
            // leaving it modular like this so i can extend it if i need to a post or options func
            var xhr = new XMLHttpRequest();
            return {
                // post: function (url, body, success, err) {
                //     var string = JSON.stringify(body);
                //     xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                //     xhr.setRequestHeader('Content-length', string.length);
                //     xhr.setRequestHeader('Connection', 'close');
                //     xhr.open('POST', url, true);
                //     xhr.send(null);
                //     xhr.onreadystatechange = function () {
                //         //if (xhr.readyState === 4) {}
                //     };
                // },
                get: function (url, query, success, err) {
                    if (query) {
                        // this is a stylistic choice but i like it; i can pass an object in and it gets turned into
                        // a query string
                        var queryString = '';
                        var counter = 0;
                        for (var prop in query) {
                            if (query.hasOwnProperty(prop)) {
                                if (counter === 0) {
                                    queryString += '?' + prop + '=' + query[prop];
                                    counter++;
                                } else {
                                    queryString += '&' + prop + '=' + query[prop];
                                    counter++;
                                }
                            }
                        }
                    }
                    xhr.open('GET', url + queryString, true);
                    xhr.send(null);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            success(JSON.parse(xhr.response));
                        } else if (xhr.readyState === 4 && (xhr.status === 500 || xhr.status === 404)) {
                            err(xhr.status);
                        }
                    };
                }
            };
        };
        var fetch = function () {
            var what;
            var where;
            var query = input.value.split(' ');
            //check for predicate position
            for (var i = 0; i < query.length; i++) {
                var word = query[i];
                // never used, saving in case we can do some sort of predicate
                // lensing.. ie nearby is close than near is closer than around
                // also maybe things like 'west of' and 'east of' could be explored
                var predicate;
                // used to split the query
                var predicatePosition;
                for (var x = 0; x < predicates.length; x++) {
                    if (word === predicates[x]) {
                        predicate = predicates[x];
                        predicatePosition = i;
                    }
                }
                // concatenate all words before the predicate to figure out what
                what = function () {
                    var buildAWhat = '';
                    for (var i = 0; i < predicatePosition; i++) {
                        buildAWhat += query[i] + ' ';
                    }
                    return buildAWhat;
                }();
                //concatenate all words after the predicate to figure out where
                where = function () {
                    var buildAWhere = '';
                    for (var z = predicatePosition + 1; z < query.length; z++) {
                        buildAWhere += query[z] + ' ';
                    }
                    return buildAWhere;
                }();
            }
            // don't want to make a bad query
            if (what && where) {
                // geocodes the where, then executes callbacks
                codeAddress(where, function (googResponse) {
                    request().get('http://coresearch.citymaps.com/search/' + what, {
                        lat: googResponse[0].geometry.location.k,
                        lon: googResponse[0].geometry.location.D
                    }, function (response) {
                        if (response.items.length === 0) {
                            window.alert('There were no results, please try again');
                        }
                        for (var m = 0; m < markers.length; m++) {
                            markers[m].setMap(null);
                        }
                        markers = [];
                        for (var y = 0; y < response.items.length; y++) {
                            var item = response.items[y];
                            var latLng = new google.maps.LatLng(item.lat, item.lon);
                            var marker = new google.maps.Marker({
                                position: latLng,
                                title: item.name,
                                map: map
                            });
                            markers.push(marker);
                        }
                    }, function (err) {
                        window.alert('There was an error with the citymaps API, please try again', err);
                    });
                });
            } else {
                window.alert('Please try rephrasing your query');
            }
        };
        button.onclick = fetch;
    };
})();
