'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location) {
    $scope.isCollapsed = true;
    $scope.links = [
      {
        name: 'Dashboard',
        sref: 'dashboard'
      },
      {
        name: 'NetConsole',
        sref: 'netConsole'
      },
      {
        name: 'Settings',
        sref: 'settings'
      }
    ];
    $rootScope.$on('closeNavbar', function () {
      $scope.isCollapsed = true;
    });
  });
