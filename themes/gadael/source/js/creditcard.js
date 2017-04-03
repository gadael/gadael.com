angular.module('HexoCreditcard', [])


/**
 * Controller for company settings
 */
.controller("CreditcardController", ['$scope', '$http',
function($scope, $http) {

    var now = new Date();
    $scope.months = [];
    $scope.years = [];
    var i;

    for (i = 0; i <= 11; i++) {
        $scope.months.push(1+i);
    }

    for (i = 0; i <= 10; i++) {
        $scope.years.push(i+now.getFullYear());
    }

    var path = document.location.pathname.split('/');
    var currentRootFolder = 'en';
    if (undefined !== path[1]) {
        currentRootFolder = path[1];
    }

    $scope.creditcard = {};

    $http.get('/'+currentRootFolder+'/creditcard')
    .then(function(response) {
        $scope.creditcard = response.data;
    })
    .catch(function(response) {
        console.log(response);
    });


    function stripeResponseHandler(status, response) {

        if (response.error) { // Problem!
            return alert(response.error.message);
        }

        var post = {
            stripeId: response.id
        };

        $http.post('/'+currentRootFolder+'/save-account-creditcard', post)
        .then(function(response) {
            document.location.reload();
        })
        .catch(function(response) {
            var err = response.data;
            alert(err.message);
        });
    }


    $scope.saveCard = function() {
        Stripe.setPublishableKey('pk_test_NQQfxEp03QaFUUSuxSYISJC0');
        Stripe.card.createToken($scope.creditcard, stripeResponseHandler);
    };

}]);
