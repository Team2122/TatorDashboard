'use strict';

angular.module('TatorDashboard')
  .controller('SensorsCtrl', function ($scope, sensors, sensorsLog, alerts, $interval, fs, pwd) {
    var POWER_FILE_NAME = pwd.in('power.csv');
    fs.readFile(POWER_FILE_NAME, function (err, data) {
      if (err) {
        throw err;
      }
      var datas = data.toString().split('\n').map(function (line) {
        return line.split(',').map(function (value) {
          return parseFloat(value);
        });
      });
      if (!datas) return;
      if (!datas[1]) return;
      var line = 1;
      var interval = $interval(function () {
        if (!sensorsLog.enabled) {
          return;
        }
        var data = datas[line++];
        line %= datas.length;
        sensors.emit('data', data);
        var chartData = $scope.timeGraph.series[0].data;
        chartData.push(data[1]);
        if (chartData.length > $scope.samples * 1) {
          chartData.shift();
        }
        var chartData = $scope.timeGraph.series[1].data;
        chartData.push(data[2]);
        if (chartData.length > $scope.samples * 1) {
          chartData.shift();
        }
        if (line % 5 !== 0) {
          return;
        }
        $scope.voltageGauge.series[0].data[0] = data[1];
        $scope.currentGauge.series[0].data[0] = data[2];
        $scope.flukeCurrentGauge.series[0].data[0] = data[3];
      }, 20);
      $scope.$on('destroy', function () {
        $interval.cancel(interval);
      });
    });

    var gaugeBase = {
      options: {
        chart: {
          type: 'gauge',
          width: 225,
          height: 225,
          animation: true
        },
        pane: {
          startAngle: -140,
          endAngle: 140
        }
      },
      yAxis: {
        tickColor: '#666',
        minorTickColor: '#888'
      }
    };
    $scope.voltageGauge = $.extend(true, {
      series: [{
        name: 'Voltage',
        data: [0.0],
        tooltip: {
          valueSuffix: 'V'
        }
      }],
      title: {
        text: 'Voltage'
      },
      yAxis: {
        min: 4.0,
        max: 14.0,
        tickInterval: 1.0,
        plotBands: [{
          from: 4.0,
          to: 6.0,
          color: '#DF5353' // red
        }, {
          from: 6.0,
          to: 8.0,
          color: '#DDDF0D' // yellow
        }, {
          from: 8.0,
          to: 14.0,
          color: '#55BF3B' // green
        }]
      }
    }, gaugeBase);
    $scope.currentGauge = $.extend(true, {
      series: [{
        name: 'Current',
        data: [0.0],
        tooltip: {
          valueSuffix: 'A'
        }
      }],
      title: {
        text: 'Current'
      },
      yAxis: {
        min: 0.0,
        max: 180.0,
        tickInterval: 20.0,
        minorTickInterval: 5.0,
        plotBands: [{
          from: 0.0,
          to: 100.0,
          color: '#55BF3B' // green
        }, {
          from: 100.0,
          to: 140.0,
          color: '#DDDF0D' // yellow
        }, {
          from: 140.0,
          to: 180.0,
          color: '#DF5353' // red
        }]
      }
    }, gaugeBase);
    $scope.flukeCurrentGauge = $.extend(true, {
      title: {
        text: 'Fluke Current'
      }
    }, $scope.currentGauge);
    $scope.timeGraph = {
      options: {
        chart: {
          type: 'line',
          animation: false,
          zoomType: 'x'
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            },
            dashStyle: 'ShortDot'
          }
        }
      },
      title: {
        text: 'Graph'
      },
      yAxis: [{
        labels: {
          format: '{value}V'
        },
        title: {
          text: 'Volts'
        },
        min: 4.0,
        max: 14.0
      }, {
        labels: {
          format: '{value}A'
        },
        title: {
          text: 'Amps'
        },
        min: 0.0,
        max: 180.0,
        opposite: true
      }],
      series: [{
        name: 'Voltage',
        yAxis: 0,
        data: []
      }, {
        name: 'Current',
        yAxis: 1,
        data: []
      }]
    };

    $scope.samples = "50";
    $scope.$watch('samples', function (samples) {
      var series = $scope.timeGraph.series;
      series[0].data = sensorsLog.data[0].slice(sensorsLog.data[0].length - (samples * 1));
      series[1].data = sensorsLog.data[1].slice(sensorsLog.data[1].length - (samples * 1));
    });

    $scope.enabled = sensorsLog.enabled;
    sensorsLog.on('enabled', function (enabled) {
      $scope.enabled = enabled;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });

    $scope.start = function () {
      sensorsLog.start();
    };

    $scope.pause = function () {
      sensorsLog.stop();
    };

    $scope.stop = function () {
      sensorsLog.stop();
      sensorsLog.data = [];
    };

    $scope.save = function () {
      sensorsLog.save(function (err) {
        alerts.add('danger', 'Failed to save sensors log: ' + err);
      });
    };

    sensors.on('data', function (data) {
      $scope.data = data;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });
  });
