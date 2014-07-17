'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.isCollapsed = true;
    $scope.links = [
      {
        name: 'Dashboard',
        address: '/dashboard'
      },
      {
        name: 'NetConsole',
        address: '/netConsole'
      },
      {
        name: 'Settings',
        address: '/settings'
      }
    ];
    $scope.isActive = function (link) {
      return $location.path() === link.address;
    };
  });
