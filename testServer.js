'use strict';

var net = require('net');
var _ = require('lodash');

var config = {
  "Drive": {
    "Active": false,
    "maxRPM": 13,
    "driveL": {
      "Slot": 1,
      "Port": 1
    },
    "driveR": {
      "Slot": 1,
      "Port": 4
    },
    "encoderL": {
      "SlotOne": 1,
      "PortOne": 1,
      "SlotTwo": 1,
      "PortTwo": 2
    },
    "encoderR": {
      "SlotOne": 1,
      "PortOne": 4,
      "SlotTwo": 1,
      "PortTwo": 3
    },
    "pidL": {
      "P": 0.125,
      "I": 0.015,
      "D": 0
    },
    "pidR": {
      "P": -0.125,
      "I": -0.015,
      "D": 0
    },
    "leftStick": {
      "Stick": 1,
      "Axis": 2,
      "Deadzone": 0.1,
      "Exponent": 3
    },
    "rightStick": {
      "Stick": 1,
      "Axis": 4,
      "Deadzone": 0.1,
      "Exponent": 3
    }
  },
  "Catapult": {
    "Active": true,
    "windMotor": {
      "Slot": 1,
      "Port": 2
    },
    "hoodControl": {
      "Slot": 1,
      "PortOne": 7,
      "PortTwo": 8
    },
    "encoder": {
      "Slot": 1,
      "Port": 2
    },
    "fireVoltage": 0.5,
    "fireWindSpeed": 0.5,
    "cockVoltage": 0.5,
    "cockWindSpeed": 0.5,
    "encoderOffset": -3.7,
    "CockCatapult": {
      "cockVoltage": 4.6,
      "cockSpeed": 0.75
    },
    "FireCatapult": {
      "fireVoltageMin": 0.2,
      "fireVoltageMax": 1,
      "fireSpeed": 1.0
    }
  },
  "Picker": {
    "Active": true,
    "roller": {
      "Slot": 1,
      "Port": 3,
      "Speed": 1.0
    },
    "intakePistons": {
      "Shoot": {
        "Slot": 1,
        "PortOne": 1,
        "PortTwo": 2
      },
      "Pick": {
        "Slot": 1,
        "PortOne": 3,
        "PortTwo": 4
      }
    },
    "ballSensor": {
      "Slot": 1,
      "Port": 5
    }
  },
  "Joystick": {
    "Buttons": [
      {
        "Stick": 1,
        "Button": 4,
        "Event": "WhenPressed",
        "Command": "CockCatapult"
      },
      {
        "Stick": 1,
        "Button": 5,
        "Event": "WhenPressed",
        "Command": "PickerToPick"
      },
      {
        "Stick": 1,
        "Button": 6,
        "Event": "WhenPressed",
        "Command": "PickerToShoot"
      },
      {
        "Stick": 1,
        "Button": 7,
        "Event": "WhenPressed",
        "Command": "Pick"
      },
      {
        "Stick": 1,
        "Button": 8,
        "Event": "WhenPressed",
        "Command": "FireCatapult"
      },
      {
        "Stick": 1,
        "Button": 9,
        "Event": "WhenPressed",
        "Command": "PickerToLoad"
      },
      {
        "Stick": 1,
        "Button": 10,
        "Event": "WhenPressed",
        "Command": "ShootSequence"
      }
    ]
  },
  "Tester": {
    "Joystick": 1
  },
  "Logger": {
    "Outputs": {
      "NetConsole": {
        "debug": true,
        "info": true,
        "warn": true,
        "error": true
      }
    }
  }
};

var port = process.argv[2] || 9796;
var server = net.createServer(function (socket) {
  console.log('TatorDashboard client connected from %s', socket.remoteAddress);
  socket.on('end', function () {
    console.log('TatorDashboard client disconnected');
  });
  socket.on('error', function (err) {
    console.log('Socket error: %j', err);
  });
  var recBuf = new Buffer(0);
  socket.on('data', function (data) {
    recBuf = Buffer.concat([recBuf, data]);
    while (recBuf.length >= 4) {
      var len = recBuf.readInt32BE(0);
      if (recBuf.length < 4 + len) {
        return;
      }
      var string = recBuf.toString('utf8', 4, 4 + len);
      recBuf = recBuf.slice(4 + len);
      var json;
      try {
        json = JSON.parse(string);
      } catch (err) {
        return console.log('Error parsing received json: %j', err);
      }
      socket.emit('json', json);
    }
  });
  socket.on('send', function (json) {
    var string = JSON.stringify(json);
    var sendBuf = new Buffer(4 + string.length);
    sendBuf.writeInt32BE(string.length, 0);
    sendBuf.write(string, 4);
    socket.write(sendBuf);
  });
  var validateProperty = function (json, property, message) {
    if (!json.hasOwnProperty(property)) {
      throw new Error(message);
    }
  };
  var methods = {
    "test": function (args, cb) {
      cb('test');
    },
    "getConfig": function (args, cb) {
      cb(config);
    },
    "setConfig": function (args, cb) {
      config = args;
      cb();
    },
    "saveConfig": function (args, cb) {
      console.log('Saved... (not really)');
      cb(true);
    }
  };

  function handleRequest(json) {
    validateProperty(json, 'id', 'Received request without an id');
    var id = json.id;
    validateProperty(json, 'method', 'Received request with a method');
    var method = json.method;
    var args = json.hasOwnProperty('arguments') ? json.arguments : null;
    validateProperty(methods, method, 'Method ' + method + ' does not exist');
    methods[method](args, function (response) {
      socket.emit('send', {
        type: 'response',
        id: id,
        response: response
      });
    });
  }

  socket.on('json', function (json) {
    validateProperty(json, 'type', 'Received json without a type');
    switch (json.type) {
      case 'request':
        handleRequest(json);
        break;
      default:
        throw new Error('Invalid type ' + json.type);
    }
  });
});

server.listen(port, function () {
  var address = server.address();
  console.log('TatorDashboard server listening on %s address %s:%s', address.family, address.address, address.port);
});
