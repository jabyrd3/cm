define([], function () {
    // array of possible prepositions. currently only accepts 1 word ie no 'near by'
    var prepositions = ['in', 'at', 'by', 'nearby', 'near', 'around'];
    // used to split the query
    var prepPosition;
    // used to lens the search based on ranking closeness
    var prepRank;
    // used for display
    var preposition;
    // concatenate all words before the preposition to find what
    var what = function (query) {
        var buildAWhat = '';
        for (var i = 0; i < prepPosition; i++) {
            buildAWhat += query[i] + ' ';
        }
        return buildAWhat;
    };
    //concatenate all words after the preposition to find where
    var where = function (query) {
        var buildAWhere = '';
        for (var z = prepPosition + 1; z < query.length; z++) {
            buildAWhere += query[z] + ' ';
        }
        return buildAWhere;
    };
    return {
        query: function (splitArray) {
            //check for preposition position
            for (var i = 0; i < splitArray.length; i++) {
                var word = splitArray[i];
                for (var x = 0; x < prepositions.length; x++) {
                    if (word === prepositions[x]) {
                        preposition = prepositions[x];
                        prepPosition = i;
                        prepRank = x;
                        break;
                    }
                }
            }
            return {
                what: what(splitArray),
                where: where(splitArray),
                preposition: preposition,
                position: prepRank
            };
        }
    };
});
