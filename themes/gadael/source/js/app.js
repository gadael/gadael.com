angular.module('HexoApp', ['HexoSearch', 'HexoPage', 'HexoSession', 'HexoCompanies'])

.config(['$locationProvider', function($locationProvider) {

    $locationProvider.html5Mode(true);
}]);
