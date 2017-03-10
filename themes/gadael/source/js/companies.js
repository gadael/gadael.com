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

    $http.get('/company').then(function(response) {
        $scope.company = response.data.company;
        $scope.passwordSet = response.data.passwordSet;

    }).catch(function() {
        // company not accessible
        document.location.href = '/';
    });



    $scope.updateCompany = function() {

        var post = {
            company: $scope.company
        };

        $http.put('/company/'+$scope.company.dbname, post).then(function(response) {
            document.location.reload();
        }).catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    };

}]);
