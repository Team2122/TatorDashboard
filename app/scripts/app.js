'use strict';

angular.module('TatorDashboard', ['ui.router', 'ui.bootstrap', 'ui.sortable', 'ngAnimate', 'ngSanitize'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .state('dashboard.configs', {
        url: '/dashboard/configs',
        templateUrl: 'views/configs.html',
        controller: 'ConfigsCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('netConsole', {
        url: '/netConsole',
        templateUrl: 'views/netConsole.html',
        controller: 'NetConsoleCtrl'
      });
  });
