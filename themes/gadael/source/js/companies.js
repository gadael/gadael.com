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


    var now = new Date();
    $scope.months = [];
    $scope.years = [];
    var i;

    for (i = 0; i <= 11; i++) {

        $scope.months.push({
            value: 1+i,
            label: 1+i
        });
    }

    for (i = 0; i <= 10; i++) {

        $scope.years.push({
            value: i+now.getFullYear(),
            label: i+now.getFullYear()
        });
    }



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


    $scope.getMonths = function() {

    };


    function stripeResponseHandler(status, response) {

        if (response.error) { // Problem!
            return alert(response.error.message);
        }


        $scope.stripeToken = response.id;
        // TODO: submit stripe token
    }


    $scope.saveCard = function() {
        Stripe.setPublishableKey('pk_test_NQQfxEp03QaFUUSuxSYISJC0');
        Stripe.card.createToken($scope.creditcard, stripeResponseHandler);
    };

}]);
