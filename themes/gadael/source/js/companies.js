angular.module('HexoCompanies', [])


/**
 * Controller for company settings
 */
.controller("CompaniesController", ['$scope', '$http',
function($scope, $http) {

    $scope.create = {
        dbname: '',
        country: 'FR'
    };

    $scope.companyLoad = 'company-loading';

    $http.get('/company').then(function(response) {
        $scope.companyLoad = 'company-loaded';
        $scope.company = response.data.company;
        $scope.passwordSet = response.data.passwordSet;
        $scope.plan = response.data.plan;

    }).catch(function() {
        // company not accessible
        document.location.href = '/';
    });






    $scope.updateCompany = function() {

        var post = {
            company: $scope.company
        };

        $http.put('/company/'+$scope.company.dbname, post)
        .then(function(response) {
            document.location.reload();
        }).catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    };


}]);
