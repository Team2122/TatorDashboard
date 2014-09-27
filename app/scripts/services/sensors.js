'use strict';

angular.module('TatorDashboard')
  .factory('sensors', function (client, EventEmitter) {
    var sensors = new EventEmitter();

    client.on('message', function (msg) {
      if (msg.type === 'sensors') {
        sensors.emit('data', msg.sensors);
      }
    });

    sensors.enabled = function (enabled, cb) {
      client.request('setSensors', enabled, function (en) {
        sensors.emit('enabled', en);
        (cb || angular.noop)(en);
      });
    };

    return sensors;
  });
