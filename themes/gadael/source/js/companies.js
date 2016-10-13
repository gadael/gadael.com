angular.module('HexoCompanies', [])


/**
 * Controller for search result dropdown
 */
.controller("CompaniesController", ['$scope', '$http',
function($scope, $http) {

    $scope.create = {
        dbname: 'hexo',
        country: 'FR'
    };

    $http.get('/company').then(function(response) {
        $scope.company = response.data.company;

        if (response.status !== 200) {
            document.location.href = '/';
        }
    });


    $scope.createCompany = function() {

        $http.post('/company', $scope.create).then(function(response) {
            document.location.reload();
        }).catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    };


    $scope.updateCompany = function() {

        $http.put('/company/'+$scope.company.dbname, $scope.company).then(function(response) {
            document.location.reload();
        }).catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    };

}]);
