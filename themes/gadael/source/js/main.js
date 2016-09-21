
function getParameterByName(name, url) {
    if (!url) url = window.location.search;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var main = document.querySelector("#main");
var highlight = getParameterByName('highlight');
if (main && highlight) {
    console.log(highlight);
    var markInstance = new Mark(main);
    markInstance.mark(highlight, {
        separateWordSearch: true,
        accuracy: 'exactly'
    });
}
