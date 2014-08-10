'use strict';

angular.module('TatorDashboard')
  .controller('NetConsoleCtrl', function ($scope, netConsole, alerts, robotIp) {
    $scope.robotIp = robotIp();
    $scope.buffer = '';
    $scope.message = '';
    $scope.highlight = true;

    $scope.send = function () {
      netConsole.send($scope.message);
      $scope.buffer += $scope.message + "\n";
      $scope.message = '';
    };

    netConsole.on('message', function (msg) {
      $scope.$apply(function () {
        $scope.buffer += msg;
      });
    });
    netConsole.on('error', function (err) {
      alerts.add('danger', 'Error with NetConsole: ' + err);
    });

    // Autoscroll
    $scope.$watch('buffer', function () {
      var scroll = $('.netconsole pre')[0];
      if (scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight) {
        $scope.$evalAsync(function () {
          scroll.scrollTop = scroll.scrollHeight;
        });
      }
    });
  }).filter('trust', function ($sce) {
    return $sce.trustAsHtml;
  }).filter('colorize', function ($sanitize) {
    return function (txt) {
      function genRegexFunc(className) {
        return function (str) {
          var start = '<span class="' + className + '">';
          var end = '</span>';
          if (str.indexOf('\n') === 0) {
            start = '\n' + start;
          }
          if (str.lastIndexOf('\n') === str.length - 1) {
            end += '\n';
          }
          return start + str.replace('\n','') + end;
        };
      }
      return $sanitize(txt)
        .replace(/(\n|^) *(\[\w+ *\] *)*==== *.*==== *(\n|$)/, genRegexFunc('console-section'))
        .replace(/(\n|^) *\[DEBUG *\].*(\n|$)/, genRegexFunc('console-debug'))
        .replace(/(\n|^) *\[INFO *\].*(\n|$)/, genRegexFunc('console-info'))
        .replace(/(\n|^) *\[WARN *\].*(\n|$)/, genRegexFunc('console-warn'))
        .replace(/(\n|^) *\[ERROR *\].*(\n|$)/, genRegexFunc('console-error'));
    };
  });
