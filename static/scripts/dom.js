define([], function () {
    var input = document.getElementsByTagName('input')[0];
    var button = document.getElementById('the-button');
    var form = document.getElementById('the-form');
    var resultList = document.getElementById('result-list');
    var ul;
    var mapWrap = document.getElementById('map-canvas');
    form.onsubmit = function () {
        return false;
    };
    return {
        input: input,
        button: button,
        form: form,
        list: resultList,
        listDOM: function (results) {
            ul = document.createElement('ul');
            ul.className = 'list-group';
            for (var i = 0; i < results.items.length; i++) {
                var item = results.items[i];
                var li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = item.name + ' | ' + item.city;
                ul.appendChild(li);
            }
            resultList.className = 'col-md-4';
            mapWrap.className = 'col-md-8';
            window.setTimeout(function () {
                resultList.appendChild(ul);
            }, 500);
        },
        deleteList: function () {
            if (ul !== undefined) {
                resultList.removeChild(ul);
                mapWrap.className = 'col-md-12';
                resultList.className = '';
            }
        }
    };
});
