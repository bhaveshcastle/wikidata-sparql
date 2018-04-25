(function () {
  'use strict';

  angular
    .module('app')
    .controller('QueryWikidataController', QueryWikidataController);

  QueryWikidataController.$inject = ['QueryService', '$rootScope', '$mdDialog'];
  function QueryWikidataController(QueryService, $rootScope, $mdDialog) {
    let vm = this;
    vm.searchType = "1";
    vm.show_data = false;
    vm.query = null;
    vm.actions = [
      {
        key: "query_wikidata",
        name: 'Query Wikidata',
        description: "Query Wikidata"
      }
    ];
    vm.wikiData = [];

    vm.queryWikidata = function (event) {
      if (!this.query) {
        return $rootScope.showAlert(event, 'Invalid Query', 'Please enter valid Query', 'Got it!')
      }
      let query = {
        search_param: this.query,
        type: this.searchType
      };

      QueryService
        .Query(query)
        .then((response) => {
          let query_data = response.data;
          // $scope.query_data = query_data;
          if (query_data.length > 0) {
            query_data.map((row) => {
              let data = [];
              for (let key in row) {
                data.push({ key, value: row[key] });  
              }
              vm.wikiData.push(data);
            });
            vm.show_data = true;
          } else {
            $rootScope.showAlert(this, 'Response', 'No data found!!!', 'Ok');
          }  
        }, (error) => {
          $rootScope.showAlert(this, 'Response', error.message, 'Ok');
        }).then(() => {
          this.query = null;
        });
    };

    vm.searchAgain = function (event) {
      vm.show_data = false;
    }
  }

})();