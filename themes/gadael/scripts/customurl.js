

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
