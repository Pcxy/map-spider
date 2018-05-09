'use strict';

require('babel-polyfill');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 3000;

_server2.default.listen(PORT);

_logger2.default.info('application start in at ' + PORT + '...');