'use strict';

angular.module('TatorDashboard', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngTable'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/netConsole', {
        templateUrl: 'views/netConsole.html',
        controller: 'NetConsoleCtrl'
      })
      .when('/teamList', {
        templateUrl: 'views/teamList.html',
        controller: 'TeamListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
