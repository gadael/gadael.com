
/**
 * Get insersection between configured languages and navigator language
 * @param {object} config
 * @return {String}
 */
function getLanguage(config)
{
    var language = window.navigator.userLanguage || window.navigator.language;
    if (-1 === config.language.indexOf(language)) {
        language = language.substr(0,2);

        if (-1 === config.language.indexOf(language)) {
            language = null;
        }
    }

    return language;
}
