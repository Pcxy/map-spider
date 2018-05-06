import path from 'path';
import fs from 'fs';
import superagent from 'superagent';
import * as TileLngLatTransform from 'tile-lnglat-transform';
import eachLimit from 'async/eachLimit';


let rootPath = path.resolve('./');
// console.log(rootPath);
fs.mkdir(`${rootPath}/tile`, (err) => {
  console.log('创建tile目录出错', err);
})

let topLeft = [118.443494, 32.451448];
let topRight = [121.276678, 32.451448];
let buttomLeft = [118.443494, 30.877948];
let buttomRight = [121.276678, 30.877948];

let TileLnglatTransformBaidu = TileLngLatTransform.TileLnglatTransformBaidu;

let tiles = [];

for(let z = 3; z < 18; z++) {
  let tile = {};
  tile.topLeftTile = TileLnglatTransformBaidu.lnglatToTile(topLeft[0], topLeft[1], z);
  tile.topRightTile = TileLnglatTransformBaidu.lnglatToTile(topRight[0], topRight[1], z);
  tile.buttomLeftTile = TileLnglatTransformBaidu.lnglatToTile(buttomLeft[0], buttomLeft[1], z);
  tile.buttomRightTile = TileLnglatTransformBaidu.lnglatToTile(buttomRight[0], buttomRight[1], z); 
  tiles.push(tile);
}

console.log('tiles', tiles);

const baseUrl = 'http://api0.map.bdimg.com/customimage/tile?&udt=20180505&scale=1&ak=WUPGA6Sx8MrHBrds4n48PfU8t4twHVIl&customid=dark';
let urlObjects = [];

tiles.forEach((tile, index) => {
  const z = index + 3;
  // const tile = tiles[12];
  // let z = 15;
  fs.mkdir(`${rootPath}/tile/${z}`, err => {
    if (err) {
      console.err(`创建tile/${z}出错`, err);
    }
  });
  let minX = tile.topLeftTile.tileX;
  let maxX = tile.buttomRightTile.tileX;
  let minY = tile.buttomRightTile.tileY;
  let maxY = tile.topLeftTile.tileY;
  for (let x = minX; x <= maxX; x++) {
    fs.mkdir(`${rootPath}/tile/${z}/${x}`, err => {
      if (err) {
        console.error(`创建tile/${z}/${x}目录出错`, err);
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

eachLimit(urlObjects, 100, (urlObject, callback) => {
  console.log(`开始抓取瓦片, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`);
  fetchPage(urlObject, callback);
}, (err) => {
  console.error(`async eachLimit 出错`, err);
});

let curCount = 0;
function fetchPage(urlObject, callback) {
  let delay = parseInt((Math.random() * 30000000) % 1000, 10);
  curCount++;
  console.log('现在的并发数是', curCount, '，正在抓取的是', urlObject.url, '，耗时' + delay + '毫秒');
  superagent.get(urlObject.url).end((err, res) => {
    if (err) {
      console.error(`抓取瓦片出错, x: ${urlObject.x} y: ${urlObject.y} z: ${urlObject.z}`, err);
      return;
    }
    saveFile(urlObject, res.body);
  });
  setTimeout(() => {
    curCount--;
    callback(null, 'Call back content');
  }, delay);
}


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

function saveFile(urlObject, content) {
  // console.log('content', content);
  fs.writeFile(`${rootPath}/tile/${urlObject.z}/${urlObject.x}/${urlObject.y}.jpg`, content, err => {
    if (err) {
      console.error(`写入文件出错 path: ${rootPath}/tile/${urlObject.z}/${urlObject.x}/${urlObject.y}.jpg`, err);
    }
  });
}



/*  test transform
let topLeftTile = TileLnglatTransformBaidu.lnglatToTile(topLeft[0], topLeft[1], 15);
let topRightTile = TileLnglatTransformBaidu.lnglatToTile(topRight[0], topRight[1], 15);
let buttomLeftTile = TileLnglatTransformBaidu.lnglatToTile(buttomLeft[0], buttomLeft[1], 15);
let buttomRightTile = TileLnglatTransformBaidu.lnglatToTile(buttomRight[0], buttomRight[1], 15);
console.log('topLeftTile', topLeftTile);
console.log('topRightTile', topRightTile);
console.log('buttomLeftTile', buttomLeftTile);
console.log('buttomRightTile', buttomRightTile);

topLeftTile { tileX: 6438, tileY: 1855 }
topRightTile { tileX: 6592, tileY: 1855 }
buttomLeftTile { tileX: 6438, tileY: 1755 }
buttomRightTile { tileX: 6592, tileY: 1755 }
*/
