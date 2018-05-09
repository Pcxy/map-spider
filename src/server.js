import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from 'koa-router';
import cors from 'koa2-cors';
import os from 'os';

import logger from './logger';
import spider, { emitter } from './spider';

const HOSTNAME = os.hostname();

let app = new Koa();

let isSpiding = false;

emitter.on('over', () => {
  isSpiding = false;
});

app.use(cors());

app.use(async (ctx, next) => {
  logger.info(`will process request: ${ctx.request.method} ${ctx.request.url}`);
  let start = Date.now();
  let execTime;

  try {
    await next();
  } catch (e) {
    logger.error('error process request.', e);
  }
  logger.info(`Response: ${ctx.response.status}`);
  execTime = Date.now() - start;
  ctx.response.set('X-Response-Time', `${execTime} ms`);
  ctx.response.set('X-Host', HOSTNAME);
});

app.use(bodyParser());

app.use(async (ctx, next) => {
  const pathPrefix = '/api/';
  let request = ctx.request;
  let response = ctx.response;
  if (request.path.startsWith(pathPrefix)) {
    logger.info(`process API ${request.method} ${request.url}...`);
    ctx.rest = (data) => {
      response.type = 'application/json';
      response.body = data;
    };
    try {
      await next();
    } catch (e) {
      logger.warn('process API error', e);
      response.status = 400;
      response.type = 'application/json';
      response.body = {
        error: e.error || 'internal: unknown_error',
        data: e.data || null,
        message: e.message || ''
      };
    }
  } else {
    await next();
  }
});

let rt = router();
rt['get']('/api/status', async (ctx, next) => {
  logger.info('processing api/status');
  ctx.rest({
    isSpiding,
  });
});
rt['post']('/api/set', async (ctx, next) => {
  let parameter = ctx.response.body;
  if (isSpiding) {
    ctx.rest({
      message: '正在抓取中，请稍后...'
    });
  } else {
    let data = ctx.request.body;
    const { leftTop, rightButtom, ak, theme } = data;
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
    isSpiding = true;
    await spider(leftTop, rightButtom, ak, theme);
    ctx.rest({
      code: 0,
      message: '开始抓取...'
    });
  }
});


app.use(rt.routes());

export default app;

export {
  isSpiding
}