define([], function () {
    // leaving it modular like this so i can extend it if i need to a post or options func
    var xhr = new XMLHttpRequest();
    return {
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
});
