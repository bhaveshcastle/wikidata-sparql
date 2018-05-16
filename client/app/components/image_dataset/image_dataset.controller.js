(function () {
  'use strict';

  angular
    .module('app')
    .controller('ImageDatasetController', ImageDatasetController);

  ImageDatasetController.$inject = ['ImageDatasetService', '$rootScope', '$mdDialog'];
  function ImageDatasetController(ImageDatasetService, $rootScope, $mdDialog) {
    let vm = this;
    vm.spam_url_list = [];
    vm.whitelist_urls = [];
    vm.blacklist_urls = [];
    vm.detect_url_regex = "";// = [];
    vm.user = $rootScope.userData;

    vm.ban_logic_actions = [
      {
        key: "ban_regex",
        name: "Ban Regex",
        description: "Logic being used to ban users"
      }
    ];

    fetch_bot_ban_data();

    function fetch_bot_ban_data() {
    //   ImageDatasetService
    //     .fetchBotBanData()
    //     .then((response) => {
    //       vm.spam_url_list = response.data.spam_url_list;
    //       vm.whitelist_urls = response.data.whitelist_urls;
    //       vm.blacklist_urls = response.data.blacklist_urls;
    //       vm.bot_ban_regex = response.data.bot_ban_regex;
    //     }, (error) => {
    //       showAlert(null, 'Response', error.message, 'Ok');
    //     });
    }

    vm.blacklist_url = function (url) {
      ImageDatasetService
      .blacklistSpamUrl(url)
      .then((response) => {
        fetch_bot_ban_data();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.add_dataset = function (url) {
      ImageDatasetService
      .whitelistSpamUrl(url)
      .then((response) => {
        fetch_bot_ban_data();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.updateBanRegex = function () {
      ImageDatasetService
      .updateBanRegex(vm.bot_ban_regex)
      .then((response) => {
        fetch_bot_ban_data();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.revertBlacklistUrl = function (url) {
      ImageDatasetService
      .revertSpamUrl({
        spam_url: url
        , type: 'black'
        })
      .then((response) => {
        fetch_bot_ban_data();
      }, (error) => {
        showAlert(null, 'Response', error.message, 'Ok');
      });
    };

    vm.revertWhitelistUrl = function (url) {
      ImageDatasetService
      .revertSpamUrl({
        spam_url: url
        , type: 'white'
        })
      .then((response) => {
        fetch_bot_ban_data();
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
