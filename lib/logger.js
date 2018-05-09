'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({
    name: 'console',
    colorize: true,
    level: 'info',
    timestamp: true
  }), new _winston2.default.transports.File({
    name: 'info-file',
    dirname: '/tmp',
    filename: 'mapspider-info.log',
    level: 'info',
    json: false,
    maxsize: 100 * 1024 * 1024, // 100M
    maxFiles: 20,
    timestamp: function timestamp() {
      return new Date().toString();
    }
  }), new _winston2.default.transports.File({
    name: 'error-file',
    dirname: '/tmp',
    filename: 'mapspider-error.log',
    level: 'error',
    json: false,
    maxsize: 100 * 1024 * 1024, // 100M
    maxFiles: 50,
    timestamp: function timestamp() {
      return new Date().toString();
    }
  })]
});

exports.default = logger;