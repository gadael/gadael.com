angular.module('HexoCompanies', [])


/**
 * Controller for search result dropdown
 */
.controller("CompaniesController", ['$scope', '$http',
function($scope, $http) {
    $http.get('/company').then(function(response) {
        $scope.company = response.data.company;

        if (response.status !== 200) {
            document.location.href = '/';
        }
    });


    $scope.createCompany = function() {

        var create = {
            dbname: $scope.dbname,
            country: $scope.country
        };

        console.log(create);

        $http.post('/company', create).then(function(response) {
            console.log(response);
        }).catch(console.error);
    };

}]);
