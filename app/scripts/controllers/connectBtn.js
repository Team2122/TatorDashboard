'use strict';

angular.module('TatorDashboard')
  .controller('ConnectBtnCtrl', function ($scope, client, alerts) {
    var btnStates = {
      disconnected: {
        class: 'btn-default',
        text: 'Disconnected',
        icon: ''
      },
      connected: {
        class: 'btn-success',
        text: 'Connected',
        icon: 'fa-check'
      },
      connecting: {
        class: 'btn-warning',
        text: 'Connecting',
        icon: 'fa-spin fa-refresh'
      },
      error: {
        class: 'btn-danger',
        text: 'Error',
        icon: 'fa-warning'
      }
    };
    $scope.btn = btnStates.disconnected;
    client.on('connected', function () {
      $scope.$apply(function () {
        $scope.btn = btnStates.connected;
      });
    });
    client.on('disconnected', function (isError) {
      if (!isError) {
        $scope.$apply(function () {
          $scope.btn = btnStates.disconnected;
        });
      }
    });
    client.on('error', function (err) {
      $scope.$apply(function () {
        $scope.btn = btnStates.error;
      });
      alerts.add('danger', 'TatorDashboard client error: ' + err);
    });
    $scope.btnClick = function () {
      if (client.connected) {
        $scope.btn = btnStates.disconnected;
        client.socket.end();
      } else {
        $scope.btn = btnStates.connecting;
        client.connect();
      }
    };
  });
