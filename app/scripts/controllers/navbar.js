'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $rootScope) {
    $scope.isCollapsed = true;
    $scope.links = [
      {
        name: 'Dashboard',
        icon: 'fa-dashboard',
        sref: 'dashboard'
      },
      {
        name: 'NetConsole',
        icon: 'fa-terminal',
        sref: 'netConsole'
      },
      {
        name: 'Settings',
        icon: 'fa-cog',
        sref: 'settings'
      }
    ];
    $rootScope.$on('closeNavbar', function () {
      $scope.isCollapsed = true;
    });
  });
