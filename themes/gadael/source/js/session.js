angular.module('HexoSession', [])


/**
 * Controller for search result dropdown
 */
.controller("PageController", ['$scope', '$http',
function($scope, $http) {
    $http.get('/session').then(function(response) {
        $scope.session = response.data;
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
        link : function(scope,element,attrs) {

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


            var testAvailability = debounce(function() {
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
                });
            }, 500);


            element.on('keyup', function() {

                if (this.value === lastcheck) {
                    return;
                }

                var container = getDbNameContainer(this);
                container.addClass('dbname-loading');
                container.removeClass('dbname-invalid');
                container.removeClass('dbname-valid');
                container[0].setAttribute('title', '');
                testAvailability.bind(this)();
            });
        }
    };
}]);
