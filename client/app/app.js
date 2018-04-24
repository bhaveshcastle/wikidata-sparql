(function () {
  'use strict';

  angular
    .module('app', ['ngRoute', 'ngCookies', 'ngMaterial'])
    .config(config)
    .run(run);

  config.$inject = ['$routeProvider', '$locationProvider'];
  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeController',
        templateUrl: 'components/home/home.view.html',
        controllerAs: 'vm'
      })

      .when('/query', {
        controller: 'QueryWikidataController',
        templateUrl: 'components/query_wikidata/query_wikidata.view.html',
        controllerAs: 'vm'
      })

      .otherwise({redirectTo: '/'});
  }

  run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$mdDialog'];
  function run($rootScope, $location, $cookies, $http, $mdDialog) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      
    });

    $rootScope.showAlert = function(event, alertTitle, alertContent, alertConfirmationText) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(alertTitle)
          .textContent(alertContent)
          .ok(alertConfirmationText)
          .targetEvent(event)
      );
    }
  }

})();
