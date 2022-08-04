import { startBrowser } from './browser';
import { startAPI } from './api';

startAPI();

if (process.argv[2] != '--disable-browser') {
    startBrowser();
}
