'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSpiding = undefined;

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koa2Cors = require('koa2-cors');

var _koa2Cors2 = _interopRequireDefault(_koa2Cors);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _spider = require('./spider');

var _spider2 = _interopRequireDefault(_spider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var HOSTNAME = _os2.default.hostname();

var app = new _koa2.default();

var isSpiding = false;

_spider.emitter.on('over', function () {
  exports.isSpiding = isSpiding = false;
});

app.use((0, _koa2Cors2.default)());

app.use(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    var start, execTime;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _logger2.default.info('will process request: ' + ctx.request.method + ' ' + ctx.request.url);
            start = Date.now();
            execTime = void 0;
            _context.prev = 3;
            _context.next = 6;
            return next();

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](3);

            _logger2.default.error('error process request.', _context.t0);

          case 11:
            _logger2.default.info('Response: ' + ctx.response.status);
            execTime = Date.now() - start;
            ctx.response.set('X-Response-Time', execTime + ' ms');
            ctx.response.set('X-Host', HOSTNAME);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.use((0, _koaBodyparser2.default)());

app.use(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
    var pathPrefix, request, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pathPrefix = '/api/';
            request = ctx.request;
            response = ctx.response;

            if (!request.path.startsWith(pathPrefix)) {
              _context2.next = 19;
              break;
            }

            _logger2.default.info('process API ' + request.method + ' ' + request.url + '...');
            ctx.rest = function (data) {
              response.type = 'application/json';
              response.body = data;
            };
            _context2.prev = 6;
            _context2.next = 9;
            return next();

          case 9:
            _context2.next = 17;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](6);

            _logger2.default.warn('process API error', _context2.t0);
            response.status = 400;
            response.type = 'application/json';
            response.body = {
              error: _context2.t0.error || 'internal: unknown_error',
              data: _context2.t0.data || null,
              message: _context2.t0.message || ''
            };

          case 17:
            _context2.next = 21;
            break;

          case 19:
            _context2.next = 21;
            return next();

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[6, 11]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

var rt = (0, _koaRouter2.default)();
rt['get']('/api/status', function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger2.default.info('processing api/status');
            ctx.rest({
              isSpiding: isSpiding
            });

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
rt['post']('/api/set', function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
    var parameter, data, leftTop, rightButtom, ak, theme;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            parameter = ctx.response.body;

            if (!isSpiding) {
              _context4.next = 5;
              break;
            }

            ctx.rest({
              message: '正在抓取中，请稍后...'
            });
            _context4.next = 13;
            break;

          case 5:
            data = ctx.request.body;
            leftTop = data.leftTop, rightButtom = data.rightButtom, ak = data.ak, theme = data.theme;

            try {
              leftTop[0] = parseFloat(leftTop[0]);
              leftTop[1] = parseFloat(leftTop[1]);
              rightButtom[0] = parseFloat(rightButtom[0]);
              rightButtom[1] = parseFloat(rightButtom[1]);
            } catch (e) {
              ctx.rest({
                code: 1,
                message: '坐标转换异常'
              });
            }
            console.log('data', data);
            exports.isSpiding = isSpiding = true;
            _context4.next = 12;
            return (0, _spider2.default)(leftTop, rightButtom, ak, theme);

          case 12:
            ctx.rest({
              code: 0,
              message: '开始抓取...'
            });

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

app.use(rt.routes());

exports.default = app;
exports.isSpiding = isSpiding;