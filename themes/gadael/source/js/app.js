angular.module('HexoApp', ['HexoSearch', 'HexoPage', 'HexoSession', 'HexoCompanies'])

.run(['$location', '$rootElement', function ($location, $rootElement) {
      $rootElement.off('click');
}]);
