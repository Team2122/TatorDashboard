'use strict';

angular.module('TatorDashboard')
  .controller('SidebarCtrl', function ($scope) {
    var setCollapsed = function (collapsed) {
      if (collapsed) {
        $scope.collapsed = true;
        $scope.collapseIcon = 'fa-chevron-right';
      } else {
        $scope.collapsed = false;
        $scope.collapseIcon = 'fa-chevron-left';
      }
    };
    setCollapsed(false);
    $scope.toggleCollapsed = function () {
      setCollapsed(!$scope.collapsed);
    };
    $scope.links = [
      [
        {
          name: 'Overview',
          sref: 'dashboard'
        }
      ],
      [
        {
          name: 'Configs',
          sref: 'dashboard.configs'
        }
      ]
    ];
  });
