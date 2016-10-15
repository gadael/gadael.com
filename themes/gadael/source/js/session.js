angular.module('HexoSession', [])


/**
 * Controller for search result dropdown
 */
.controller("PageController", ['$scope', '$http',
function($scope, $http) {
    $http.get('/session').then(function(response) {
        $scope.session = response.data;
    });
}]);
