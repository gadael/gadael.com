/**
* Langurl Helper
* @description Get the url from a path in the same language
* @example
*     <%- langurl('account/settings') %>
*/
hexo.extend.helper.register('langurl', function(relativePath) {
    var currentRootFolder = this.page.path.split('/')[0];
    return '/'+currentRootFolder+'/'+relativePath;
});



/**
* Versionurl Helper
* Page with same file number and same language
* @description Get the url from a documentation version folder name
* @example
*     <%- versionurl('version-master') %>
*/
hexo.extend.helper.register('versionurl', function(folderName) {
    var currentFolders = this.page.path.split('/');
    var currentRootFolder = currentFolders[0];
    var currentFile = currentFolders[3];
    return '/'+currentRootFolder+'/docs/'+folderName+'/'+currentFile;
});
