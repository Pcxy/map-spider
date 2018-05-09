import 'babel-polyfill';
import app from './server';
import logger from './logger';

const PORT = 3000;

app.listen(PORT);

logger.info(`application start in at ${PORT}...`);