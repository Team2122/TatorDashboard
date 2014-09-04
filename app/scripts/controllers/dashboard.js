'use strict';

angular.module('TatorDashboard')
  .controller('DashboardCtrl', function ($scope, client, alerts, config) {
    $scope.sendData = {};
    $scope.enabled = client.connected;
    client.on('connectivityChanged', function(connected) {
      $scope.$apply(function () {
        $scope.enabled = connected;
      });
    });
    $scope.stringify = JSON.stringify;
    $scope.request = {
      method: "test",
      args: {}
    };
    $scope.client = client;
    $scope.send = function () {
      client.send($scope.sendData);
    };
    $scope.req = function () {
      var method = $scope.request.method;
      var args = $scope.request.args;
      client.request(method, args, function (response) {
        alerts.add('info', 'Received response from method ' + method + ': ' + JSON.stringify(response), true);
      });
    };
  });
