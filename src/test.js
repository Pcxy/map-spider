import superagent from 'superagent';

superagent.get('http://api0.map.bdimg.com/customimage/tile?&x=788&y=292&z=12&udt=20180505&scale=1&ak=WUPGA6Sx8MrHBrds4n48PfU8t4twHVIl&customid=dark').end((err, res) =>{
  console.log(res);
})