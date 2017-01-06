/**
* getDocUrl Helper
* @description Get url, same doc version, same language
* @example
*     <%= getDocUrl(path) %>
*/
hexo.extend.helper.register('getDocUrl', function(path) {
    var currentUrl = this.page.path.replace(/^\/+|\/+$/g, '');
    var currentFolders = currentUrl.split('/');

    if ('index.html' === currentFolders[currentFolders.length-1]) {
        currentFolders.pop();
    }

    if (currentFolders.length <= 3) {
        return null;
    }

    var lang = currentFolders.shift();
    currentFolders.shift();
    var version = currentFolders.shift();
    return '/'+lang+'/docs/'+version+'/'+path;
});

/**
* getDocPageVersions Helper
* @description Get page versions urls on same language
* @example
*     <% var arr = getDocPageVersions() %>
*/
hexo.extend.helper.register('getDocPageVersions', function() {
    function pInfo(page) {
        var currentFolders = page.path.split('/');

        if (currentFolders.length !== 4 || currentFolders[1] !== 'docs') {
            return null;
        }

        return {
            lang: currentFolders[0],
            version: currentFolders[2].substr('version-'.length),
            num: currentFolders[3].substr(0, 3)
        };
    }

    var here = pInfo(this.page);
    var versions = [];

    if (null === here) {
        return [];
    }

    for (var i=0; i<this.site.pages.length; i++) {
        var other = pInfo(this.site.pages.data[i]);
        if (null !== other && other.lang === here.lang && other.num === here.num) {
            versions.push({
                url: '/'+this.site.pages.data[i].path,
                label: other.version
            });
        }
    }



    return versions;
});




/**
* getSubPages Helper
* @description On the index, get sub-pages sorted by permalink
* @example
*     <% var arr = getSubPages(page) %>
*/
hexo.extend.helper.register('getSubPages', function(page) {

    var pages = this.site.pages;
    var subpages = [];

    for (var i=0; i<pages.data.length; i++) {
        var link = pages.data[i].permalink;
        var docRoot = page.permalink.substr(0, page.permalink.length - "index.html".length);
        if (docRoot === link.substr(0, docRoot.length)) {
            var doc = pages.data[i];
            var arr = doc.source.split('/');
            var file = arr[arr.length-1];
            if (file !== 'index.md' && file !== 'index.html') {
                subpages.push(doc);
            }
        }
    }

    return subpages.sort(function(page1, page2) {
        return page1.permalink.localeCompare(page2.permalink);
    });
});
