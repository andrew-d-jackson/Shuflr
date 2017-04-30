import Koa from 'koa';
import Router from 'koa-router';
import Static from 'koa-static-server';
import bluebird from 'bluebird';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const readFile = bluebird.promisify(fs.readFile);

export default () => {
  const port = 3000;

  const app = new Koa();
  const router = new Router();

  router.get('/', async (ctx) => {
    const templatePath = path.join(__dirname, 'templates', 'index.ejs');
    const template = await readFile(templatePath, 'utf-8');
    const html = ejs.render(template);
    ctx.body = html;
  });

  const staticPath = path.join(__dirname, '..', 'static');
  const staticServer = Static({rootDir: staticPath, rootPath: '/static'});
  app.use(staticServer);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app.listen(port, () => {
    console.log('App started on port ' + port);
  });
};
