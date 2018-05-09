'use strict';

import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: 'console',
      colorize: true,
      level: 'info',
      timestamp: true
    }),
    new winston.transports.File({
      name: 'info-file',
      dirname: '/tmp',
      filename: 'mapspider-info.log',
      level: 'info',
      json: false,
      maxsize: 100 * 1024 * 1024, // 100M
      maxFiles: 20,
      timestamp: function () {
        return new Date().toString();
      }
    }),
    new winston.transports.File({
      name: 'error-file',
      dirname: '/tmp',
      filename: 'mapspider-error.log',
      level: 'error',
      json: false,
      maxsize: 100 * 1024 * 1024, // 100M
      maxFiles: 50,
      timestamp: function () {
        return new Date().toString();
      }
    })
  ]
});

export default logger;