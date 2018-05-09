import path from 'path';
import fs from 'fs';
import EventEmitter from 'events'
import superagent from 'superagent';
import * as TileLngLatTransform from 'tile-lnglat-transform';
import eachLimit from 'async/eachLimit';
import logger from './logger';

const emitter = new EventEmitter();

export {
  emitter
}


async function spider(topLeft, buttomRight, ak, theme) {

  logger.info(`开始调用spider, leftTop: ${topLeft}, rightButtom: ${buttomRight}, ak:${ak}, theme:${theme}`);
  
  // let rootPath = path.resolve('./');
  // console.log(rootPath);
  let rootPath = '/usr/local/nginx/html';
  fs.mkdir(`${rootPath}/tile`, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        logger.warn(`${rootPath}/tile目录已存在`, err);
      } else {
        logger.error(`创建${rootPath}/tile目录时出错`, err);
      }
    }
  });

  fs.mkdir(`${rootPath}/tile/${theme}`, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        logger.warn(`${rootPath}/tile/${theme}目录已存在`, err);
      } else {
        logger.error(`创建${rootPath}/tile/${theme}目录时出错`, err);
      }
    }
  })
  
  // let topLeft = [118.443494, 32.451448];
  // let buttomRight = [120.878261, 31.145358];
  
  let TileLnglatTransformBaidu = TileLngLatTransform.TileLnglatTransformBaidu;
  
  let tiles = [];
  
  for(let z = 3; z <= 18; z++) {
    let tile = {};
    tile.topLeftTile = TileLnglatTransformBaidu.lnglatToTile(topLeft[0], topLeft[1], z);
    // tile.topRightTile = TileLnglatTransformBaidu.lnglatToTile(topRight[0], topRight[1], z);
    // tile.buttomLeftTile = TileLnglatTransformBaidu.lnglatToTile(buttomLeft[0], buttomLeft[1], z);
    tile.buttomRightTile = TileLnglatTransformBaidu.lnglatToTile(buttomRight[0], buttomRight[1], z); 
    tiles.push(tile);
  }
  
  // console.log('tiles', tiles);
  
  // const baseUrl = `http://api0.map.bdimg.com/customimage/tile?&udt=20180505&scale=1&ak=WUPGA6Sx8MrHBrds4n48PfU8t4twHVIl&customid=dark`;
  const baseUrl = `http://api0.map.bdimg.com/customimage/tile?&udt=20180505&scale=1&ak=${ak}&customid=${theme}`
  let urlObjects = [];
  let errorUrlObjects = [];
  
  tiles.forEach((tile, index) => {
    const z = index + 3;
    fs.mkdir(`${rootPath}/tile/${theme}/${z}`, err => {
      if (err) {
        if (err.code === 'EEXIST') {
          logger.warn(`目录tile/${theme}/${z}已存在`, err);
        } else {
          logger.error(`创建目录tile/${theme}/${z}时出错`, err);
        }
      }
    });
    let minX = tile.topLeftTile.tileX;
    let maxX = tile.buttomRightTile.tileX;
    let minY = tile.buttomRightTile.tileY;
    let maxY = tile.topLeftTile.tileY;
    for (let x = minX; x <= maxX; x++) {
      fs.mkdir(`${rootPath}/tile/${theme}/${z}/${x}`, err => {
        if (err) {
          if (err.code === 'EEXIST') {
            logger.warn(`目录tile/${theme}/${z}/${x}目录已存在`, err);
          } else {
            logger.error(`创建tile/${theme}/${z}/${x}目录出错`, err);
          }
        }
      });
      for (let y = minY; y <= maxY; y++) {
        urlObjects.push({
          url: `${baseUrl}&x=${x}&y=${y}&z=${z}`,
          x: x,
          y: y,
          z: z
        })
      }
    }
  })
  
  let errorUrl = [];
  
  let curCount = 0;
  let fetchPage = function(urlObject, callback) {
    let delay = parseInt((Math.random() * 30000000) % 1000, 10);
    curCount++;
    console.log('现在的并发数是', curCount, '，正在抓取的是', urlObject.url, '，耗时' + delay + '毫秒');
    superagent.get(urlObject.url).end((err, res) => {
      if (err) {
        logger.error(`抓取瓦片出错, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`, err);
        errorUrlObjects.push[urlObject];
        return;
      }
      saveFile(urlObject, res.body);
    });
    setTimeout(() => {
      curCount--;
      callback(null, 'Call back content');
    }, delay);
  }
  
  eachLimit(urlObjects, 20, (urlObject, callback) => {
    console.log(`开始抓取瓦片, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`);
    fetchPage(urlObject, callback);
  }, (err) => {
    if (err) {
      console.error(`async eachLimit 出错`, err);
    }
    console.log('出错瓦片：', errorUrlObjects);
    emitter.emit('over', true);
  });
  
  function saveFile(urlObject, content) {
    // console.log('content', content);
    fs.writeFile(`${rootPath}/tile/${theme}/${urlObject.z}/${urlObject.x}/${urlObject.y}.jpg`, content, err => {
      if (err) {
        logger.error(`写入文件出错 path: ${rootPath}/tile/${theme}/${urlObject.z}/${urlObject.x}/${urlObject.y}.jpg`, err);
      }
    });
  }

}

export default spider;



