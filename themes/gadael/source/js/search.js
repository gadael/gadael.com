angular.module('HexoSearch', [])

.factory('searchRequest', ['$http', '$q', function($http, $q) {
    var lunrResource;

    function searchIndex(q) {
        if (undefined === q) {
            return [];
        }

        var refs = lunrResource.index.search(q);
        var results = [];
        for (var i=0; i<refs.length; i++) {
            results.push(lunrResource.store[refs[i].ref]);
        }

        return results;
    }

    return function(q) {
        if (!lunrResource) {
            return downloadJSONFile().then(function(dlIndex) {
                lunrResource = dlIndex;
                return searchIndex(q);
            });
        } else {
            return $q.when(searchIndex(q));
        }
    };

    function downloadJSONFile() {
        return $http.get('/assets/lunr/all.json').then(function(response) {

            lunr.multiLanguage.apply(this, response.data.languages);

            return {
                index: lunr.Index.load(response.data.index),
                store: response.data.store
            };
        });
    }

}])

/**
 * Controller for search result dropdown
 */
.controller("SearchController", ['$scope', 'searchRequest',
function($scope, searchRequest) {

    var ctrl = this;
    $scope.$watch(function() {
        return $scope.hexoSearchQuery;
    }, function(q) {
        searchRequest(q).then(function(results) {
            ctrl.results = results;
        });
    });

    $scope.isDocumentation = function(result) {
        return -1 !== result.url.indexOf('/docs/');
    };

    $scope.isHealth = function(result) {
        return -1 !== result.cates.indexOf('Health');
    };

    $scope.isBlog = function(result) {
        return (!$scope.isHealth(result) && result.url.match(/\d{4}\/\d{2}\/\d{2}/));
    };
}])

/**
 * data-hexo-search-bar
 */
.directive('hexoSearchBar', ['$rootScope', function($rootScope) {
    return {
        scope: true,
        controllerAs: 'searchCtrl',
        /**
         * Controller for search bar
         */
        controller : [function() {
            this.value = function(v) { // data-ng-model with getterSetter option
                return arguments.length ? ($rootScope.hexoSearchQuery = v) : $rootScope.hexoSearchQuery;
            };
        }]
    };
}])


.directive('hexoSearchResults', ['$rootScope', function($rootScope) {
    return {
        templateUrl: '/ng-templates/search_results.html',
        controllerAs: 'searchResultsCtrl',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            var ctrl = this;
            $scope.$watchCollection($attrs.hexoSearchResults, function(results) {
                for (var i=0; i<results.length; i++) {
                    var url = results[i].url;
                    var n = url.lastIndexOf("#");
                    var separator = -1 === url.indexOf('?') ? '?' : '&';
                    if (-1 !== url.indexOf('highlight=')) {
                        results[i].url = url.replace(/(highlight=)[^\&]+/, '$1' + encodeURIComponent($rootScope.hexoSearchQuery));
                        continue;
                    }

                    var param = separator+"highlight="+encodeURIComponent($rootScope.hexoSearchQuery);
                    if (-1 === n) {
                        results[i].url += param;
                    } else {
                        results[i].url = url.substring(0,n)+param+url.substring(n);
                    }
                }
                ctrl.results = results;

            });
        }]
    };
}]);
