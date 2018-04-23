(function () {
  'use strict';

  angular
    .module('app')
    .factory('HttpService', HttpService);

  HttpService.$inject = ['$http', '$rootScope', '$location'];
  function HttpService($http, $rootScope, $location) {
    let service = {};
    service.http = http;
    return service;

    function http(req) {
      return $http(req).then(function (response) {
        let responseData = response.data;
        if (responseData && responseData.return_code == "0") {
          const data = responseData ? (responseData.data ? responseData.data : responseData) : {};
          return { success: true, message: "Success", data };
        } else if (data && data.error) {
          return handleError(data.error);
        } else {
          return handleError('Something went wrong while creating user');
        }
      }, function (errorResponse) {
        let data = errorResponse.data;
        return handleError(data && data.error || 'Something went wrong');
      });
    }


     function handleError(error) {
      return {success: false, message: error};
    }

    
  }
})();