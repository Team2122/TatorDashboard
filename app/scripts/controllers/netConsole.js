'use strict';

var format = require('util').format;

angular.module('TatorDashboard')
  .controller('NetConsoleCtrl', function ($scope, netConsole, netConsoleBuffer, alerts, settings, robotIp) {
    $scope.robotIp = '';
    settings.whenLoaded(function () {
      $scope.robotIp = robotIp();
    });

    function highlightLine(line) {
      var highlights = {
        'console-section': /====/,
        'console-debug': /\[DEBUG\]/,
        'console-info': /\[INFO ?\]/,
        'console-warn': /\[WARN ?\]/,
        'console-error': /\[ERROR\]/
      };
      for (var className in highlights) {
        if (highlights[className].test(line)) {
          line = format('<span class="%s">%s</span>', className, line);
          break;
        }
      }
      return line;
    }

    var buffer = angular.copy(netConsoleBuffer.buffer);
    buffer = buffer.split('\n').map(function (line) {
      return highlightLine(line);
    }).join('\n');

    $scope.buffer = buffer;
    $scope.message = '';
    $scope.highlight = true;

    $scope.send = function () {
      netConsole.send($scope.message);
      $scope.buffer += $scope.message + "\n";
      $scope.message = '';
    };

    $scope.clear = function () {
      $scope.buffer = '';
      netConsoleBuffer.buffer = '';
    };

    netConsole.on('message', function (msg) {
      msg = highlightLine(msg);
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
  });
