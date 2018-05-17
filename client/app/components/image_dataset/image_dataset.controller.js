(function () {
  'use strict';

  angular
    .module('app')
    .controller('ImageDatasetController', ImageDatasetController);

  ImageDatasetController.$inject = ['ImageDatasetService', '$rootScope', '$mdDialog', '$scope'];
  function ImageDatasetController(ImageDatasetService, $rootScope, $mdDialog, $scope) {
    let vm = this;
    vm.dataset_list = [];
    vm.label_list = [];
    vm.newLabelDataset;
    vm.newImageDataset;
    vm.viewImageDataset;
    vm.label_list_for_dataset = [];
    vm.label_list_for_dataset_view = [];
    vm.selectedLabels = [];
    vm.selectedLabelsView = [];
    vm.user = $rootScope.userData;

    $scope.sort = {
      sortingOrder: "id",
      reverse: false
    };

    $scope.next_end = false;

    $scope.config = {
      page_size: 1,
      reference: Number.MAX_SAFE_INTEGER,
      sorting_order: "DESC",
      offset_type: "next"
    };

    $scope.gap = 5;
    $scope.fetchedImages = [];
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    vm.find_images = function (dataset, labels){
      if(!dataset){
        showAlert(null, 'Invalid Input', 'Please enter dataset', 'Ok');
      }
      let dataset_id = dataset.id;
      ImageDatasetService
      .fetchImages(dataset_id, labels, $scope.config)
      .then((response) => {
        console.log(response.data);
        $scope.fetchedImages = response.data;
        $scope.config.reference =
          response.data &&
          response.data.length ?
          response.data[response.data.length - 1].created_at_epoch : $scope.config.sorting_order == 'ASC' ? Number.MAX_SAFE_INTEGER : 0;
        if (response.data.length < $scope.config.page_size) {
          $scope.next_end = true;
        }
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      })
    }

    $scope.sort_by = function(newSortingOrder, dataset, labels) {
      if ($scope.config.sorting_order == "ASC") {
        $scope.config.sorting_order = "DESC";
        $scope.config.reference = Number.MAX_SAFE_INTEGER;
        $scope.config.offset_type = "next";
        $scope.currentPage = 0;
      } else {
        $scope.config.sorting_order = "ASC";
        $scope.config.reference = 0;
        $scope.config.offset_type = "next";
        $scope.currentPage = 0;
      }
      vm.find_images(dataset, labels);
    };

    $scope.prevPage = function (dataset, labels) {
      if ($scope.currentPage <= 0) { return; }
      $scope.next_end = false;
      $scope.currentPage--;
      $scope.config.reference = $scope.fetchedImages.length ? $scope.fetchedImages[0].created_at_epoch : $scope.config.reference;
      $scope.config.offset_type = 'prev';
      vm.find_images(dataset, labels);
    };

    $scope.nextPage = function (dataset, labels) {
      if ($scope.next_end == true) { return;}
      $scope.currentPage++;
      $scope.config.offset_type = 'next';
      vm.find_images(dataset, labels);
    };

    $scope.setPage = function() {
      $scope.currentPage = this.n;
    };

    vm.fetch_datasets = function () {
      ImageDatasetService
        .fetchDatasets()
        .then((response) => {
          vm.dataset_list = response.data;
          if(vm.dataset_list.length){
            vm.newLabelDataset = vm.dataset_list[0];
            vm.newImageDataset = vm.dataset_list[0];
            vm.viewImageDataset = vm.dataset_list[0];
            vm.get_labels_for_dataset(vm.newImageDataset);
            vm.get_labels_for_dataset(vm.viewImageDataset);
          }
        }, (error) => {
          showAlert(null, 'Response', error.message, 'Ok');
        });
    }

    vm.fetch_datasets();

    vm.add_dataset = function (dataset_name) {
      ImageDatasetService
      .addDataset(dataset_name)
      .then((response) => {
        vm.newDatasetName = '';
        vm.fetch_datasets();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.fetch_labels = function () {
      ImageDatasetService
        .fetchLabels()
        .then((response) => {
          vm.label_list = response.data;
        }, (error) => {
          showAlert(null, 'Response', error.message, 'Ok');
        });
    }

    vm.add_label = function (label_name, dataset) {
      let dataset_id = dataset.id;
      ImageDatasetService
      .addLabel(label_name, dataset_id)
      .then((response) => {
        vm.newLabelName = '';
        vm.newLabelDataset = vm.dataset_list[0];
        vm.fetch_labels();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.get_labels_for_dataset = function (dataset) {
      let dataset_id = dataset.id;
      ImageDatasetService
        .fetchLabelsForDataset(dataset_id)
        .then((response) => {
          vm.label_list_for_dataset = response.data;
          vm.label_list_for_dataset_view = response.data;
        }, (error) => {
          showAlert(null, 'Response', error.message, 'Ok');
        });
    }

    vm.label_image = function (image_url, dataset, labels){
      if(!image_url || !dataset || !labels || !labels.length){
        showAlert(null, 'Invalid Input', 'Please enter all the fields', 'Ok');
      }
      let dataset_id = dataset.id;
      ImageDatasetService
      .labelImage(image_url, dataset_id, labels)
      .then((response) => {
        vm.newImageUrl = '';
        vm.selectedLabels = [];
        vm.fetch_datasets();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      })
    }

    function showAlert(event, alertTitle, alertContent, alertConfirmationText) {
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
