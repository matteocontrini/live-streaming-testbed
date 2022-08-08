import {startBrowser} from './browser';
import {startServer} from './api/server';

(async () => {
    await startServer();

    if (process.argv[2] != '--disable-browser') {
        await startBrowser();
    }
})();
