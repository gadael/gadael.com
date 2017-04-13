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

        var currentName = 'Full Name';
        var currentNumber = '•••• •••• •••• ••••';
        var currentExpiry = '••/••••';

        if (response.data) {

            // Initialize placeholders with current partial data if possible

            if (response.data.name) {
                currentName = response.data.name;
            }

            if (response.data.number) {
                currentNumber = response.data.number;
            }

            if (response.data.exp_month && response.data.exp_year) {
                currentExpiry = response.data.exp_month+'/'+response.data.exp_year;
                $scope.currentExpiry = currentExpiry;
            }
        }


        var card = new Card({
            form: '#account_creditcard>form',
            container: '.card-wrapper',

            formSelectors: {
                numberInput: '#creditcard_number', // optional — default input[name="number"]
                expiryInput: '#creditcard_expiry', // optional — default input[name="expiry"]
                cvcInput: '#creditcard_cvc', // optional — default input[name="cvc"]
                nameInput: '#creditcard_fullname'
            },

            // Default placeholders for rendered fields - optional
            placeholders: {
                name: currentName,
                number: currentNumber,
                expiry: currentExpiry
            }
        });
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


        var expiry = $scope.expiry.split('/');
        $scope.creditcard.exp_month = parseInt(expiry[0], 10);
        $scope.creditcard.exp_year = parseInt(expiry[1], 10);


        Stripe.setPublishableKey($scope.session.stripeKey);
        Stripe.card.createToken($scope.creditcard, stripeResponseHandler);
    };

}]);
