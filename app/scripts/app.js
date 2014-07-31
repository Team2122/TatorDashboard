'use strict';

angular.module('TatorDashboard', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngSanitize'])
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
      .otherwise({
        redirectTo: '/'
      });
  });
