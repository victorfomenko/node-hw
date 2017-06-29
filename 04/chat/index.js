const Koa = require('koa');
const co = require('co');
const fse = require('fs-extra');
const logger = require('koa-logger');
const Router = require('koa-router');

const server = new Koa();
const router = new Router();
const clients = [];

router.get('/', async(ctx) => {
    ctx.type = 'html';
    ctx.body = fse.createReadStream('index.html');
});

router.get('/subscribe', async(ctx, next) => {
    ctx.set('Content-Type', 'text/plain;charset=utf-8');
    clients.push(ctx.res);
    ctx.res.on('close', function() {
        clients.splice(clients.indexOf(ctx.res), 1);
    });
    ctx.status = 200;
    await new Promise(() => {});
});

router.post('/publish', (ctx, next) => {
    let body = '';
    ctx.req
        .on('data', function(data) {
            // -----> размер body может быть слишком большим
            body += data;

            if (body.length > 512) { // маленькое значение важно для теста, т.к. end срабатывает
                ctx.status = 413;
                ctx.body = 'Your message is too big for my little chat';
            }
        })
        .on('end', function() {
            // "end" triggers when all data consumed
            // even if it's too big
            if (ctx.status == 413) return;

            try {
                body = JSON.parse(body);
                if (!body.message) {
                    throw new SyntaxError('No message');
                }
                body.message = String(body.message);
            } catch (e) {
                res.statusCode = 400;
                res.end('Bad Request');
                return;
            }

            clients.forEach(function(res) {
                res.setHeader('Cache-Control', 'no-cache, no-store, private');
                res.end(body.message);
            });

            clients.length = 0;

            ctx.body = 'ok';
        });
});


server.use(logger()).use(router.routes()).listen(3000);
