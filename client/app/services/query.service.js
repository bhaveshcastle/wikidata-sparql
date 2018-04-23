(function () {
  'use strict';

  angular
    .module('app')
    .factory('QueryService', QueryService);

  QueryService.$inject = ['$http', '$rootScope', '$location', 'HttpService'];
  function QueryService($http, $rootScope, $location, HttpService) {
    let service = {};

    service.Query = Query;

    return service;

    function Query(params){
      const {
        search_param
      } = params;
      let req = {
        method: 'POST',
        url: '/api/v1/query',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          search_param: search_param
        }
      };
      return HttpService.http(req).then((response) => {
        return response;
      });
    }

  }

})();
