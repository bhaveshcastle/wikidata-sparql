(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['QueryService', '$rootScope', '$mdDialog'];
  function HomeController(QueryService, $rootScope, $mdDialog) {

  }

})();
