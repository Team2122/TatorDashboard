'use strict';

angular.module('TatorDashboard')
  .controller('NavbarCtrl', function ($scope, $rootScope, $state) {
    $scope.isCollapsed = true;
    $scope.links = [
      {
        name: 'Dashboard',
        icon: 'fa-dashboard',
        sref: 'dashboard'
      },
      {
        name: 'Checklist',
        icon: 'fa-check-square',
        sref: 'checklist'
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
    $scope.go = function (idx) {
      var link = $scope.links[idx];
      if (!link.disabled) {
        $state.go(link.sref);
      }
    };
    $scope.active = function (idx) {
      return $state.is($scope.links[idx].sref);
    };
    $rootScope.$on('checklistSetLocked', function (event, locked) {
      $scope.links[0].disabled = locked;
    });
    $rootScope.$on('closeNavbar', function () {
      $scope.isCollapsed = true;
    });
  });
