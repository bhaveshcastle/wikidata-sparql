(function () {

  angular.module('app')
    .directive('navBar', ['$interval', function ($interval) {

      return {
        restrict: "EAC",
        templateUrl: "directives/nav_bar/nav_bar.template.html"
      }
    }]).controller('navbarController', ['$scope', '$location', '$rootScope', 'QueryService', function ($scope, $location, $rootScope, QueryService) {
      $scope.search_param = '';

      $scope.navbarRedirection = function (key) {
        let url;
        let url_mappings = {
          "query_wikidata": {
            key: "query_wikidata",
            url: "/query-wikidata"
          }
        };
        let obj = url_mappings[key];
        if (!obj) {
          $rootScope.higlightedNav = undefined;
          return;
        }
        $rootScope.higlightedNav = key;
        $location.path(obj.url);
      }

    }]);
})();