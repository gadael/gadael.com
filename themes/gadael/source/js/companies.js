angular.module('HexoCompanies', [])


/**
 * Controller for search result dropdown
 */
.controller("CompaniesController", ['$scope', '$http',
function($scope, $http) {

    $scope.dbname = 'hexo';
    $scope.country = 'FR';

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

        $http.post('/company', create).then(function(response) {
            console.log(response);
        }).catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    };

}]);
