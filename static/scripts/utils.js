define(['map'], function (map) {
    return {
        codeAddress: function (address, callback) {
            map.geocoder.geocode({
                'address': address
            }, function (results) {
                map.map.setCenter(results[0].geometry.location);
                callback(results);
            });
        }
    };
});
