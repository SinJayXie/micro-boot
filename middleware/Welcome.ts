import { Context, Next } from 'koa';
import * as fs from 'fs';
import * as path from 'path';

const template = fs.readFileSync(path.join(__dirname, '..', '/assets/welcome.html'));

export = async (ctx: Context, next: Next) => {
  if(ctx.path === '/micro-boot-welcome') {
    ctx.status = 200;
    ctx.body = template;
    ctx.set('Content-Type', 'text/html; charset=utf-8');
  } else {
    await next();
  }
}

