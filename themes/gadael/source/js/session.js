angular.module('HexoSession', [])


/**
 * Controller for search result dropdown
 */
.controller("PageController", ['$scope', '$http', '$timeout', 'localStorageService',
function($scope, $http, $timeout, localStorageService) {

    $scope.pageLoad = 'page-loading';


    $http.get('/session').then(function(response) {
        $scope.session = response.data;
        var path = document.location.pathname.split('/');
        var currentRootFolder = 'en';
        if (undefined !== path[1]) {
            currentRootFolder = path[1];
        }

        var inPrivateSpace = false;
        if (undefined !== path[2] && 'account' === path[2]) {
            inPrivateSpace = true;
        }
        var last = null;

        if (path.length > 1) {
            last = path[path.length-1];
            if (!last && path.length > 2) {
                last = path[path.length-2];
            }
        }

        // check connexion status on privates pages
        if ($scope.isPrivate && !$scope.session.isLoggedIn) {
            document.location.href = '/'+currentRootFolder+'/private';
        }

        // check for terms and conditions acceptance in private space
        if ($scope.session.isLoggedIn && !$scope.session.user.legal && inPrivateSpace && 'legal' !== last) {
            $timeout(function() {
                document.location.href = '/'+currentRootFolder+'/account/legal/';
            }, 500);
            return;
        }

        // add to the queue to enforce class modification after page rendering
        $timeout(function() {
            $scope.pageLoad = 'page-loaded';
        }, 0);
    });

    try {
        $scope.signup = JSON.parse(localStorageService.get('signup'));
    } catch (e) {
        // ignore decode error
    }

    $scope.$watch('signup', function(value) {
        localStorageService.set('signup', JSON.stringify(value));
    }, true);
}])


/**
 * data-app-loading
 * This directive test if application is available from the loading screen
 */
.directive('appLoading', ['$http', function($http) {
    return {
        scope: true,
        controllerAs: 'loadingCtrl',
        link : function($scope, element, attrs) {

            $scope.loaded = false;
            var allowedIterations = 7;

            var dbname = getParameterByName('dbname');
            if (dbname) {
                $scope.dbname = dbname;
            } else {
                alert('This url need a dbname parameter');
            }

            function loop() {
                $http.get('/status/'+dbname, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                .then(function(response) {

                    if (response.data) {

                        var status = response.data;
                        $scope.appName = status.name;

                        if (!status.running && allowedIterations > 0) {
                            allowedIterations--;
                            return setTimeout(loop, 2000);
                        }

                        $scope.loaded = true;
                        document.location.href = status.url;
                    }
                })
                .catch(function(err) {
                    setTimeout(loop, 3000);
                });
            }


            loop();

        }
    };
}])


/**
 * data-dbname-available
 * This directive test for dbname availability on key up
 */
.directive('dbnameAvailable', ['$http', function($http) {
    return {
        scope: true,
        controllerAs: 'dbNameCtrl',
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
