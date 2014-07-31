'use strict';

var format = require('util').format;

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
        $scope.buffer += msg + '\n';
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
  }).filter('trust', function ($sce, $sanitize) {
    return function (text) {
      return $sce.trustAsHtml($sanitize(text));
    };
  }).filter('logHighlight', function () {
    return function (text) {
      var lines = text.split('\n');
      var newLines = [];
      var highlights = {
        'console-section': /====/,
        'console-debug': /\[DEBUG\]/,
        'console-info': /\[INFO ?\]/,
        'console-warn': /\[WARN ?\]/,
        'console-error': /\[ERROR\]/
      };
      for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        var line = lines[lineNumber];
        var added = false;
        for (var className in highlights) {
          if (highlights[className].test(line)) {
            newLines.push(format('<span class="%s">%s</span>', className, line));
            added = true;
            break;
          }
        }
        if (!added) {
          newLines.push(line);
        }
      }
      return newLines.join('\n');
    };
  });
