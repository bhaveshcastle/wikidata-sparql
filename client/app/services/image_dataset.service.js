(function () {
  'use strict';

  angular
    .module('app')
    .factory('ImageDatasetService', ImageDatasetService);

  ImageDatasetService.$inject = ['$http', '$rootScope', '$location', 'HttpService'];
  function ImageDatasetService($http, $rootScope, $location, HttpService) {
    let service = {};

    service.fetchDatasets = fetchDatasets;
    service.addDataset = addDataset;
    service.fetchLabels = fetchLabels;
    service.addLabel = addLabel;
    return service;

    function fetchDatasets() {
      let req = {
        method: 'GET',
        url: '/api/v1/get_all_datasets',
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

    function addDataset(dataset_name) {
      let req = {
        method: 'POST',
        url: '/api/v1/create_dataset',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          dataset_name: dataset_name 
        }
      };
      return HttpService.http(req).then((response) => {
        if (response.success) {
          response.message = "Data fetched successfully";
        }
        return response;
      });
    }

    function fetchLabels() {
      let req = {
        method: 'GET',
        url: '/api/v1/get_all_labels',
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

    function addLabel(label_name, dataset_id) {
      let req = {
        method: 'POST',
        url: '/api/v1/create_label',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          label: label_name,
          ds_type: dataset_id
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
