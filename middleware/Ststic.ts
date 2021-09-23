import { Context, Next } from 'koa';
import * as getFileType from '../config/fileType';
import * as fs from 'fs';
import * as path from 'path';

const staticPath = path.join(__dirname, '../assets');

const splitMine = function (name: string) {
  try {
    return name.split('.')[name.split('.').length - 1];
  } catch (e) {
    console.log('[static]: ' + name + '  Error!');
    return '';
  }

};

export = async (ctx: Context, next: Next) => {
  if(ctx.path.indexOf('/static/') !== -1) {
    if(fs.existsSync(staticPath + ctx.path)) {
      ctx.status = 200;
      ctx.set('Content-Type', getFileType(splitMine(ctx.path)));
      ctx.body = fs.createReadStream(staticPath + ctx.path);
    } else {
      ctx.status = 404;
      ctx.body = {code: 404, msg: 'assets not found', timestamp: Date.now()};
    }

  } else {
    await next();
  }
}

