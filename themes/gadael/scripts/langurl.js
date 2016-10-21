/**
* Langurl Helper
* @description Get the url from a path in the same language
* @example
*     <%- langurl('account/settings') %>
*/
hexo.extend.helper.register('langurl', function (relativePath) {
    var currentRootFolder = this.page.path.split('/')[0];
    return '/'+currentRootFolder+'/'+relativePath;
});
