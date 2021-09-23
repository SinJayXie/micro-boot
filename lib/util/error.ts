import * as fs from 'fs';
import * as path from 'path';
import { Context } from 'koa';
const errorTemplate = fs.readFileSync(path.join(__dirname, '../../assets/error-template.html'));

const createError = function (ctx: Context, stack: string) {
  // console.log(stack);
  // const regex = /\((.+?)\)/g;
  // const stackFile = stack.match(regex);
  // // @ts-ignore
  // stackFile.forEach(filePath => {
  //   console.log(filePath);
  // });
  // ctx.set('Content-Type', 'text/html; charset=utf-8');
  // return stack;
  ctx.status = 500;
  return { code: 500, msg: '系统出现异常,请稍后在尝试!', path: ctx.path, timestamp: Date.now() };
};



export = createError;
