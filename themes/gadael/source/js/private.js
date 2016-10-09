angular.module('HexoPrivate', [])


/**
 * Controller for search result dropdown
 */
.controller("AccountController", ['$scope', '$http',
function($scope, $http) {
    $http.get('/session').then(function(response) {
        $scope.session = response.data;

        if (!$scope.session.isLoggedIn) {
            document.location.href = '/';
        }
    });

}]);
