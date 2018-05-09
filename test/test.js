// import superagent from 'superagent';

// superagent.get('http://api0.map.bdimg.com/customimage/tile?&x=788&y=292&z=12&udt=20180505&scale=1&ak=WUPGA6Sx8MrHBrds4n48PfU8t4twHVIl&customid=dark').end((err, res) =>{
//   console.log(res);
// })


import fs from 'fs';
import path from 'path';

let rootPath = path.resolve('./');

// fs.mkdir(`${rootPath}/tile`, (err) => {
//   if (err) {
//     if (err.code === 'EEXIST') {
//       console.error('创建tile出错，tile已存在');
//     }
//   }
// });

fs.writeFile(`${rootPath}/tile/4/3/0.jpg`, 's', err => {
  if (err) {
    console.log('写入文件出错');
  }
})