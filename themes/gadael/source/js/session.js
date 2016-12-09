angular.module('HexoSession', [])


/**
 * Controller for search result dropdown
 */
.controller("PageController", ['$scope', '$http', '$location', '$timeout',
function($scope, $http, $location, $timeout) {

    $scope.pageLoad = 'page-loading';


    $http.get('/session').then(function(response) {
        $scope.session = response.data;

        // check connexion status on privates pages
        if ($scope.isPrivate && !$scope.session.isLoggedIn) {
            var currentRootFolder = document.location.pathname.split('/')[1];
            document.location.href = '/'+currentRootFolder+'/private';
        }

        // add to the queue to enforce class modification after page rendering
        $timeout(function() {
            $scope.pageLoad = 'page-loaded';
        }, 0);
    });
}])


/**
 * data-dbname-available
 * This directive test for dbname availability on key up
 */
.directive('dbnameAvailable', ['$http', function($http) {
    return {
        scope: true,
        controllerAs: 'searchCtrl',
        link : function(scope, element, attrs) {

            /**
             * Returns a function, that, as long as it continues to be invoked, will not
             * be triggered. The function will be called after it stops being called for
             * N milliseconds. If `immediate` is passed, trigger the function on the
             * leading edge, instead of the trailing.
             */
            function debounce(func, wait, immediate) {
            	var timeout;
            	return function() {
            		var context = this, args = arguments;
            		var later = function() {
            			timeout = null;
            			if (!immediate) func.apply(context, args);
            		};
            		var callNow = immediate && !timeout;
            		clearTimeout(timeout);
            		timeout = setTimeout(later, wait);
            		if (callNow) func.apply(context, args);
            	};
            }

            /**
             * @return {AngularElement}
             */
            function getDbNameContainer(input) {
                return angular.element(input.parentNode);
            }


            var lastcheck = null;

            /**
             * Test input content with the HTTP query
             */
            function testInput() {
                var input = this;
                var container = getDbNameContainer(input);


                $http.get('/names/'+input.value)
                .then(function(response) {
                    lastcheck = input.value;
                    container.removeClass('dbname-loading');
                    if (response.data) {
                        container.addClass('dbname-valid');
                        container.removeClass('dbname-invalid');
                        container[0].setAttribute('title', 'This site name is available');
                    } else {
                        container.addClass('dbname-invalid');
                        container.removeClass('dbname-valid');
                        container[0].setAttribute('title', 'This site name is not available');
                    }
                })
                .catch(function(err) {
                    // 404 for example
                    container.removeClass('dbname-loading');
                    container.removeClass('dbname-invalid');
                    container.removeClass('dbname-valid');
                });
            }


            var testAvailability = debounce(testInput, 500);


            function initLoadingOnContainer(input)
            {
                var container = getDbNameContainer(input);
                container.addClass('dbname-loading');
                container.removeClass('dbname-invalid');
                container.removeClass('dbname-valid');
                container[0].setAttribute('title', '');
            }


            element.on('keyup', function() {

                if (this.value === lastcheck) {
                    return;
                }

                initLoadingOnContainer(this);
                testAvailability.bind(this)();
            });


            // test on load if element contain value
            if (element.val()) {
                initLoadingOnContainer(element[0]);
                testInput.bind(element[0])();
            }
        }
    };
}]);
