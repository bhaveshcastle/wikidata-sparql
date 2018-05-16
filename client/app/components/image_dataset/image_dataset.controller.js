(function () {
  'use strict';

  angular
    .module('app')
    .controller('ImageDatasetController', ImageDatasetController);

  ImageDatasetController.$inject = ['ImageDatasetService', '$rootScope', '$mdDialog'];
  function ImageDatasetController(ImageDatasetService, $rootScope, $mdDialog) {
    let vm = this;
    vm.dataset_list = [];
    vm.label_list = [];
    vm.newLabelDataset;
    vm.user = $rootScope.userData;

    fetch_datasets();

    function fetch_datasets() {
      ImageDatasetService
        .fetchDatasets()
        .then((response) => {
          vm.dataset_list = response.data;
          if(vm.dataset_list.length){
            vm.newLabelDataset = vm.dataset_list[0];
          }
        }, (error) => {
          showAlert(null, 'Response', error.message, 'Ok');
        });
    }

    vm.add_dataset = function (dataset_name) {
      ImageDatasetService
      .addDataset(dataset_name)
      .then((response) => {
        vm.newDatasetName = '';
        fetch_datasets();
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
