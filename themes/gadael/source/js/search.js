angular.module('HexoSearch', ['HexoPlainView'])

.filter('unsafeHtml', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])


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

            lunr.multiLanguage('en', 'fr');

            return {
                index: lunr.Index.load(response.data.index),
                store: response.data.store
            };
        });
    }

}])

.controller("SearchController", ['$scope', '$window', '$location', 'searchRequest',
function($scope,   $window,   $location,   searchRequest) {

    var ctrl = this;
    $scope.$watchCollection(function() {
        return $location.search();
    }, function(data) {
        var q = decodeURIComponent(data.q);
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

.directive('hexoSearchBar', ['$location', '$window', 'hexoLocation', function($location, $window, hexoLocation) {
    return {
        scope: true,
        controllerAs: 'searchCtrl',
        controller : [function() {

            this.value = function(v) {
                if (arguments.length) {
                    hexoLocation('/'+gCurrentLang+'/search?q=' + encodeURIComponent(v));
                } else {
                    return decodeURIComponent(($location.search().q || ''));
                }
            };
        }]
    };
}])

.directive('hexoSearchResults', [function() {
    return {
        templateUrl: '/ng-templates/search_results.html',
        controllerAs: 'searchResultsCtrl',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            var ctrl = this;
            $scope.$watchCollection($attrs.hexoSearchResults, function(results) {
                ctrl.results = results;
            });
        }]
    };
}]);
