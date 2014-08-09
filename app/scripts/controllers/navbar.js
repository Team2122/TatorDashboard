'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $location, settings) {
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
