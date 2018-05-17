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
    service.fetchLabelsForDataset = fetchLabelsForDataset;
    service.labelImage = labelImage;
    service.fetchImages = fetchImages;
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

    function fetchLabelsForDataset(type) {
      let req = {
        method: 'GET',
        url: '/api/v1/get_all_labels',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        params: {
          type: type
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

    function labelImage(image_url, dataset_id, labels) {
      let req = {
        method: 'PUT',
        url: '/api/v1/save_data',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        data: {
          url: image_url,
          labels: JSON.stringify(labels),
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

    function fetchImages(dataset_id, labels, config) {
      let req = {
        method: 'GET',
        url: '/api/v1/fetch_data',
        headers: {
          "Content-Type": "application/json",
          //"x-login-token": $rootScope.userData.loginToken
        },
        params: {
          ds_type: dataset_id,
          labels: JSON.stringify(labels),
          page_size: config.page_size,
          sorting_order: config.sorting_order,
          offset_type: config.offset_type,
          reference: config.reference
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
