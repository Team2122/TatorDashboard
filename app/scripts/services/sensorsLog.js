'use strict';

angular.module('TatorDashboard')
  .factory('sensorsLog', function (sensors, EventEmitter, pwd, fs, moment) {
    var sensorsLog = new EventEmitter();

    function getLogFileName() {
      var filename = moment().format('YYYY-M-D H[h] M[m] S[s] [.csv]');
      return pwd.in('sensors', 'sensors.json');
    }

    function onData (datum) {
      for (var i = 0; i < datum.length; i++) {
        if (!sensorsLog.data[i]) {
          sensorsLog.data[i] = [];
        }
        sensorsLog.data[i].push(datum[i]);
      }
    }

    sensorsLog.enabled = false;
    sensorsLog.data = {};
    sensorsLog.start = function () {
      sensorsLog.enabled = true;
      sensorsLog.emit('enabled', true);
      sensors.on('data', onData);
    };
    sensorsLog.stop = function () {
      sensorsLog.enabled = false;
      sensorsLog.emit('enabled', false);
      sensors.removeListener('data', onData);
    };

    sensorsLog.save = function (cb) {
      fs.writeFileSync(getLogFileName(), (cb || angular.noop));
    };

    return sensorsLog;
  });
