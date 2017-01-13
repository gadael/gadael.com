angular.module('HexoPage', ['mgcrea.ngStrap.affix', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.scrollspy', 'LocalStorageModule'])

.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage');
});
