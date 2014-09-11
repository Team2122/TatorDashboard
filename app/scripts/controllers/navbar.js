'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, settings) {
    $scope.isCollapsed = true;
    function updateTheme () {
      $scope.$apply(function () {
        $scope.lightTheme = settings.settings.lightNavbar;
      });
    }
    settings.on('load', updateTheme);
    settings.on('save', updateTheme);
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
