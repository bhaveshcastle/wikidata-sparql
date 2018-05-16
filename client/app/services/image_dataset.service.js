(function () {
  'use strict';

  angular
    .module('app')
    .factory('ImageDatasetService', ImageDatasetService);

  ImageDatasetService.$inject = ['$http', '$rootScope', '$location', 'HttpService'];
  function ImageDatasetService($http, $rootScope, $location, HttpService) {
    let service = {};

    service.fetchBotBanData = fetchBotBanData;
    service.whitelistSpamUrl = whitelistSpamUrl;
    service.blacklistSpamUrl = blacklistSpamUrl;
    service.revertSpamUrl = revertSpamUrl;
    service.updateBanRegex = updateBanRegex;
    return service;

    function fetchBotBanData() {
      let req = {
        method: 'GET',
        url: '/admin/api/v1/bot_ban_data',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        }
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }

    function whitelistSpamUrl(url) {
      let req = {
        method: 'POST',
        url: '/admin/api/v1/whitelist_spam_url',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          spam_url: url 
        }
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }

    function blacklistSpamUrl(url) {
      let req = {
        method: 'POST',
        url: '/admin/api/v1/blacklist_spam_url',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          spam_url: url 
        }
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }

    function revertSpamUrl(data) {
      let req = {
        method: 'POST',
        url: '/admin/api/v1/revert_spam_url',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }

    function updateBanRegex(updated_regex) {
      let req = {
        method: 'PUT',
        url: '/admin/api/v1/update_ban_regex',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          updated_regex
        }
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }


  }

})();
