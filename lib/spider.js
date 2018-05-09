'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitter = undefined;

var spider = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(topLeft, buttomRight, ak, theme) {
    var rootPath, TileLnglatTransformBaidu, tiles, z, tile, baseUrl, urlObjects, errorUrlObjects, errorUrl, curCount, fetchPage, saveFile;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            saveFile = function saveFile(urlObject, content) {
              // console.log('content', content);
              _fs2.default.writeFile(rootPath + '/tile/' + urlObject.z + '/' + urlObject.x + '/' + urlObject.y + '.jpg', content, function (err) {
                if (err) {
                  _logger2.default.error('\u5199\u5165\u6587\u4EF6\u51FA\u9519 path: ' + rootPath + '/tile/' + urlObject.z + '/' + urlObject.x + '/' + urlObject.y + '.jpg', err);
                }
              });
            };

            _logger2.default.info('\u5F00\u59CB\u8C03\u7528spider, leftTop: ' + topLeft + ', rightButtom: ' + buttomRight + ', ak:' + ak + ', theme:' + theme);

            rootPath = _path2.default.resolve('./');
            // console.log(rootPath);

            _fs2.default.mkdir(rootPath + '/tile', function (err) {
              if (err) {
                if (err.code === 'EEXIST') {
                  _logger2.default.warn(rootPath + '/tile\u76EE\u5F55\u5DF2\u5B58\u5728', err);
                } else {
                  _logger2.default.error('\u521B\u5EFA' + rootPath + '/tile\u76EE\u5F55\u65F6\u51FA\u9519', err);
                }
              }
            });

            _fs2.default.mkdir(rootPath + '/tile/' + theme, function (err) {
              if (err) {
                if (err.code === 'EEXIST') {
                  _logger2.default.warn(rootPath + '/tile/' + theme + '\u76EE\u5F55\u5DF2\u5B58\u5728', err);
                } else {
                  _logger2.default.error('\u521B\u5EFA' + rootPath + '/tile/' + theme + '\u76EE\u5F55\u65F6\u51FA\u9519', err);
                }
              }
            });

            // let topLeft = [118.443494, 32.451448];
            // let buttomRight = [120.878261, 31.145358];

            TileLnglatTransformBaidu = TileLngLatTransform.TileLnglatTransformBaidu;
            tiles = [];


            for (z = 3; z <= 12; z++) {
              tile = {};

              tile.topLeftTile = TileLnglatTransformBaidu.lnglatToTile(topLeft[0], topLeft[1], z);
              // tile.topRightTile = TileLnglatTransformBaidu.lnglatToTile(topRight[0], topRight[1], z);
              // tile.buttomLeftTile = TileLnglatTransformBaidu.lnglatToTile(buttomLeft[0], buttomLeft[1], z);
              tile.buttomRightTile = TileLnglatTransformBaidu.lnglatToTile(buttomRight[0], buttomRight[1], z);
              tiles.push(tile);
            }

            // console.log('tiles', tiles);

            // const baseUrl = `http://api0.map.bdimg.com/customimage/tile?&udt=20180505&scale=1&ak=WUPGA6Sx8MrHBrds4n48PfU8t4twHVIl&customid=dark`;
            baseUrl = 'http://api0.map.bdimg.com/customimage/tile?&udt=20180505&scale=1&ak=' + ak + '&customid=' + theme;
            urlObjects = [];
            errorUrlObjects = [];


            tiles.forEach(function (tile, index) {
              var z = index + 3;
              _fs2.default.mkdir(rootPath + '/tile/' + theme + '/' + z, function (err) {
                if (err) {
                  if (err.code === 'EEXIST') {
                    _logger2.default.warn('\u76EE\u5F55tile/' + theme + '/' + z + '\u5DF2\u5B58\u5728', err);
                  } else {
                    _logger2.default.error('\u521B\u5EFA\u76EE\u5F55tile/' + theme + '/' + z + '\u65F6\u51FA\u9519', err);
                  }
                }
              });
              var minX = tile.topLeftTile.tileX;
              var maxX = tile.buttomRightTile.tileX;
              var minY = tile.buttomRightTile.tileY;
              var maxY = tile.topLeftTile.tileY;

              var _loop = function _loop(x) {
                _fs2.default.mkdir(rootPath + '/tile/' + z + '/' + x, function (err) {
                  if (err) {
                    if (err.code === 'EEXIST') {
                      _logger2.default.warn('\u76EE\u5F55tile/' + theme + '/' + z + '/' + x + '\u76EE\u5F55\u5DF2\u5B58\u5728', err);
                    } else {
                      _logger2.default.error('\u521B\u5EFAtile/' + theme + '/' + z + '/' + x + '\u76EE\u5F55\u51FA\u9519', err);
                    }
                  }
                });
                for (var y = minY; y <= maxY; y++) {
                  urlObjects.push({
                    url: baseUrl + '&x=' + x + '&y=' + y + '&z=' + z,
                    x: x,
                    y: y,
                    z: z
                  });
                }
              };

              for (var x = minX; x <= maxX; x++) {
                _loop(x);
              }
            });

            errorUrl = [];
            curCount = 0;

            fetchPage = function fetchPage(urlObject, callback) {
              var delay = parseInt(Math.random() * 30000000 % 1000, 10);
              curCount++;
              console.log('现在的并发数是', curCount, '，正在抓取的是', urlObject.url, '，耗时' + delay + '毫秒');
              _superagent2.default.get(urlObject.url).end(function (err, res) {
                if (err) {
                  _logger2.default.error('\u6293\u53D6\u74E6\u7247\u51FA\u9519, x: ' + urlObject.x + ' y: ' + urlObject.y + ' z: ' + urlObject.z, err);
                  errorUrlObjects.push[urlObject];
                  return;
                }
                saveFile(urlObject, res.body);
              });
              setTimeout(function () {
                curCount--;
                callback(null, 'Call back content');
              }, delay);
            };

            (0, _eachLimit2.default)(urlObjects, 20, function (urlObject, callback) {
              console.log('\u5F00\u59CB\u6293\u53D6\u74E6\u7247, x: ' + urlObject.x + ' y: ' + urlObject.y + ' z: ' + urlObject.z);
              fetchPage(urlObject, callback);
            }, function (err) {
              if (err) {
                console.error('async eachLimit \u51FA\u9519', err);
              }
              console.log('出错瓦片：', errorUrlObjects);
              emitter.emit('over', true);
            });

            // tiles.map((tile, index) => {
            //   let z = index + 3;
            //   fs.mkdir(`${rootPath}/tile/${z}`, err => {
            //     console.log(`创建tile/${z}目录出错`, err);
            //   });
            //   let minX = tile.topLeftTile.tileX;
            //   let maxX = tile.buttomRightTile.tileX;
            //   let minY = tile.buttomRightTile.tileY;
            //   let maxY = tile.topLeftTile.tileY;
            //   let urls = [];
            //   for (let x = minX; x <= maxX; x++) {
            //     fs.mkdir(`${rootPath}/tile/${z}/${x}`, err => {
            //       console.error(`创建tile/${z}/${x}目录出错`, err);
            //     });
            //     for (let y = minY; y <= maxY; y++) {
            //       urls.push({
            //         url: `${baseUrl}&x=${x}&y=${y}&z=${z}`,
            //         x: x,
            //         y: y
            //       })
            //     }
            //   }

            //   eachLimit(urls, 10, (urlObject, callback) =>{
            //     console.log(`开始抓取瓦片, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`);
            //     superagent.get(urlObject).end((err, res) => {
            //       if (err) {
            //         console.error(`抓取瓦片出错, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`, err);
            //         return;
            //       }
            //       saveFile(urlObject, res.text);
            //     })
            //   }, (err) => {
            //     console.error(`async eachLimit 出错`, err);
            //   });
            // });

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function spider(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _tileLnglatTransform = require('tile-lnglat-transform');

var TileLngLatTransform = _interopRequireWildcard(_tileLnglatTransform);

var _eachLimit = require('async/eachLimit');

var _eachLimit2 = _interopRequireDefault(_eachLimit);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var emitter = new _events2.default();

exports.emitter = emitter;
exports.default = spider;