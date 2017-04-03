angular.module('HexoApp', ['HexoSearch', 'HexoPage', 'HexoSession', 'HexoCompanies', 'HexoCreditcard'])

.run(['$location', '$rootElement', function ($location, $rootElement) {
      $rootElement.off('click');
}]);
