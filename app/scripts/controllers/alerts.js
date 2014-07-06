'use strict';

angular.module('TatorDashboard')
  .controller('AlertsCtrl', function ($scope, $timeout) {
    $scope.alerts = [];

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function (type, message, timeout) {
      var len = $scope.alerts.push({type: type, message: message});
      if (timeout) {
        $timeout(function () {
          $scope.closeAlert(len - 1);
        }, timeout);
      }
    };

    $scope.$on('alert-add', function (event, type, message, timeout) {
      $scope.addAlert(type, message, timeout);
    });
  });
