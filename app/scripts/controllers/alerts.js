'use strict';

angular.module('TatorDashboard')
  .controller('AlertsCtrl', function ($scope, $timeout) {
    $scope.alerts = [];

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function (type, message, timeout) {
      var add = function() {
        var alert = {type: type, message: message};
        $scope.alerts.push(alert);
        if (timeout) {
          $timeout(function () {
            $scope.closeAlert($scope.alerts.indexOf(alert));
          }, angular.isNumber(timeout) ? timeout : 5000);
        }
      };
      if (!$scope.$$phase) {
        $scope.$apply(add);
      } else {
        add();
      }
    };

    $scope.$on('alert-add', function (event, type, message, timeout) {
      $scope.addAlert(type, message, timeout);
    });
  });
