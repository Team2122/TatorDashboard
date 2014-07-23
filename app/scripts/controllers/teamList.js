'use strict';

angular.module('TatorDashboard')
  .controller('TeamListCtrl', function($scope, $filter, teamList, alerts, ngTableParams) {
    teamList.get().then(function(result) {
      $scope.teams = result;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          number: 'asc'
        },
        filter: {
          name: '',
          number: ''
        }
      }, {
        total: result.length,
        getData: function($defer, params) {
          var orderedData = $filter('filter')($filter('orderBy')(result, params.orderBy()), params.filter());
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }, function(err) {
      alerts.add('danger', 'Error fetching team list: ' + err);
    });
  });
