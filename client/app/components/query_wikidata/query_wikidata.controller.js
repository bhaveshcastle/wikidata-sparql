(function () {
  'use strict';

  angular
    .module('app')
    .controller('QueryWikidataController', QueryWikidataController);

  QueryWikidataController.$inject = ['QueryService', '$rootScope', '$mdDialog'];
  function QueryWikidataController(QueryService, $rootScope, $mdDialog) {
    let vm = this;

    vm.actions = [
      {
        key: "query_wikidata",
        name: 'Query Wikidata',
        description: "Query Wikidata"
      }
    ];

    vm.queryWikidata = function (event) {
      if (!this.query) {
        return $rootScope.showAlert(event, 'Invalid Query', 'Please enter valid Query', 'Got it!')
      }
      let query = {
        search_param: this.query
      };
      
      QueryService
        .Query(query)
        .then((response) => {
          let query_data = response.data;
          // $scope.query_data = query_data;
          $rootScope.showAlert(this, 'Response', query_data, 'Ok');
        }, (error) => {
          $rootScope.showAlert(this, 'Response', error.message, 'Ok');
        }).then(() => {
          // this.query = null;
        });
    };

  }

})();