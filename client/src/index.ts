import { startBrowser } from './browser';
import { startServer } from './api/server';

startServer();

if (process.argv[2] != '--disable-browser') {
    startBrowser();
}
