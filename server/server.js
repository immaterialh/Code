const { createServer } = require('node:http');
const router = require('./router.js');

console.log('started ...')

const err = (o, path) => {
    console.log('unknown route : ', path);
    o.statusCode = 404;
    o.end(`unknown route : ${path}`);
};

const server = createServer((i, o) => {
    const {url} = i;
    console.log('server request : ', url);
    const path = url.slice(1);
    o.statusCode = 200;
    return (router[path] ?? err)(o, path, i);
});

const hostname = '127.0.0.1', port = 3000;

server.listen(port, hostname,
    () => console.log(`Server running at http://${hostname}:${port}/`));