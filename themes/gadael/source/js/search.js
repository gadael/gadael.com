angular.module('HexoSearch', ['HexoPlainView'])

.filter('unsafeHtml', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])


.factory('searchRequest', ['$http', '$q', function($http, $q) {
    var index, allResults;
    return function(q) {
        if (!index) {
            return downloadJSONFile().then(function(dlIndex) {
                index = dlIndex;
                return performSearch(q, index);
            });
        } else {
            return $q.when(performSearch(q, index));
        }
    };

    function downloadJSONFile() {
        return $http.get('/assets/lunr/all.json').then(function(response) {
            return lunr.Index.load(response.data.index);
        });
    }

    function performSearch(q, loadedIndex) {
        console.log(loadedIndex);
        return fetchResults(loadedIndex.search(q));
    }

    function fetchResults(matches) {
        var results = [];
        for(var i=0;i<matches.length;i++) {
            var ref = matches[i].ref;
            results[i] = allResults[ref];
        }
        return results;
    }
}])

.controller("SearchController", ['$scope', '$window', '$location', 'searchRequest',
function($scope,   $window,   $location,   searchRequest) {

    var ctrl = this;
    $scope.$watchCollection(function() { return $location.search(); }, function(data) {
        var q = data.q;
        searchRequest(q).then(function(results) {
            ctrl.results = results;
        });
    });
}])

.directive('hexoSearchBar', ['$location', '$window', 'hexoLocation', function($location, $window, hexoLocation) {
    return {
        scope: true,
        controllerAs: 'searchCtrl',
        controller : [function() {

            this.value = function(v) {
                if (arguments.length) {
                    hexoLocation('/'+gCurrentLang+'/search?q=' + v);
                } else {
                    return ($location.search() || {}).q;
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
