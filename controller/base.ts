import {Context} from 'koa';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as Chalk from '../lib/chalk';

const viewsPath = path.join(__dirname, '../assets/views');

interface MysqlPool {
  readonly query: Function
}

interface Success {
  code: number,
  data: any,
  msg: string,
  isSuccess: boolean,
  isError: boolean,
  timestamp: number
}

interface Fail {
  code: number,
  msg: string,
  isSuccess: boolean,
  isError: boolean,
  timestamp: number
}

let _ctx: Context;
/**
 * 控制器类
 */
class Init {

  protected ctx: Context;
  protected mysql: MysqlPool
  protected SESSION: any;
  protected COOKIES: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.mysql = ctx.mysql;
    this.SESSION = this.ctx.session!;
    this.COOKIES = ctx.cookies;
    _ctx = ctx;
  }
}

export const Controller = Init;
export const success = function (data: any): Success {
  return {
    code: 200,
    data,
    msg: 'ok',
    isSuccess: true,
    isError: false,
    timestamp: Date.now()
  };
};
export const fail = function (msg: string, code: number | undefined): Fail {
  return {
    code: code ? code : -1,
    msg,
    isSuccess: false,
    isError: true,
    timestamp: Date.now()
  };
};


export const render = function (options: any) {
  const readPath = viewsPath + _ctx.path + '.ejs';
  Chalk.warn('[Render ejs]: ' + readPath);
  if(fs.existsSync(readPath)) {
    let templateString = '';
    try {
      templateString = fs.readFileSync(readPath).toString();
      set('Content-Type', 'text/html; charset=utf-8');
      return ejs.render(templateString, options);
    } catch (e: any) {
      Chalk.error(e.stack);
      setStatus(500);
      remove('Content-Type');
      return `require -> [${readPath}] \n${createSplitLine(readPath.length, '=')}\n${ e.message }\n${createSplitLine(readPath.length, '=')}\n${ templateString }`;
    }
  } else {
    return `require -> [${readPath}] not found.`;
  }
};

function createSplitLine(number: number, str: string) {
  const array: string[] = [];
  for (let i = 0; i < number; i++) {
    array.push(str);
  }
  return array.join('');
}

// ctx prototype
export const getRequest = function () { return _ctx['request']; };
export const getResponse = function () { return _ctx['response']; };
export const getApp = function () { return _ctx['app']; };
export const getReq = function () { return _ctx['req']; };
export const getRes = function () { return _ctx['res']; };
export const getOriginalUrl = function () { return _ctx['originalUrl']; };
export const getState = function () { return _ctx['state']; };
export const getMysql = function () { return _ctx['mysql']; };
export const getMatched = function () { return _ctx['matched']; };
export const getRouter = function () { return _ctx['router']; };
export const getMatchedRoute = function () { return _ctx['_matchedRoute']; };
export const getCaptures = function () { return _ctx['captures']; };
export const getParams = function () { return _ctx['params']; };
export const getRouterPath = function () { return _ctx['routerPath']; };
export const getRouterName = function () { return _ctx['routerName']; };
export const getCookies = function () { return _ctx['cookies']; };
export const getStatus = function () { return _ctx['status']; };
export const getMessage = function () { return _ctx['message']; };
export const getBody = function () { return _ctx['body']; };
export const getLength = function () { return _ctx['length']; };
export const getType = function () { return _ctx['type']; };
export const getLastModified = function () { return _ctx['lastModified']; };
export const getEtag = function () { return _ctx['etag']; };
export const getHeaderSent = function () { return _ctx['headerSent']; };
export const getWritable = function () { return _ctx['writable']; };
export const getQuerystring = function () { return _ctx['querystring']; };
export const getIdempotent = function () { return _ctx['idempotent']; };
export const getSocket = function () { return _ctx['socket']; };
export const getSearch = function () { return _ctx['search']; };
export const getMethod = function () { return _ctx['method']; };
export const getQuery = function () { return _ctx['query']; };
export const getPath = function () { return _ctx['path']; };
export const getAccept = function () { return _ctx['accept']; };
export const getOrigin = function () { return _ctx['origin']; };
export const getHref = function () { return _ctx['href']; };
export const getSubdomains = function () { return _ctx['subdomains']; };
export const getProtocol = function () { return _ctx['protocol']; };
export const getHost = function () { return _ctx['host']; };
export const getHostname = function () { return _ctx['hostname']; };
export const getUrl = function () { return _ctx['URL']; };
export const getHeader = function () { return _ctx['header']; };
export const getHeaders = function () { return _ctx['headers']; };
export const getSecure = function () { return _ctx['secure']; };
export const getStale = function () { return _ctx['stale']; };
export const getFresh = function () { return _ctx['fresh']; };
export const getIps = function () { return _ctx['ips']; };
export const getIp = function () { return _ctx['ip'];};
export const getFiles = function () { return _ctx['request']['files'];};


// ctx function
export const setMethod = function (method: string) {

  if(_ctx.method !== method.toUpperCase()) {
    _ctx.body = fail(`'${ getMethod() }' not arrow`, 403);
    throw new Error('define');
  }
};
export const setStatus = function (status: number) {
  return _ctx.status = status;
};
export const throwExpression = function (status: number, message: any) {
  return _ctx.throw(status, message);
};
export const attachment = function (filename: string, options: any) {
  return _ctx.attachment(filename, options);
};
export const redirect = function (url: string, atl: string) {
  return _ctx.redirect(url, atl);
};
export const remove = function (field: string) {
  return _ctx.remove(field);
};
export const vary = function (field: string) {
  return _ctx.vary(field);
};
export const has = function (field: string) {
  return _ctx.has(field);
};
export const set = function (field: string, value: string) {
  return _ctx.set(field, value);
};
export const append = function (field: string, value: string | string[]) {
  return _ctx.append(field, value);
};
export const flushHeaders = function () {
  return _ctx.flushHeaders();
};
export const acceptsLanguages = function () {
  return _ctx.acceptsLanguages();
};
export const acceptsEncodings = function () {
  return _ctx.acceptsEncodings();
};
export const acceptsCharsets = function () {
  return _ctx.acceptsCharsets();
};
export const accepts = function () {
  return _ctx.accepts();
};
export const get = function (field: string) {
  return _ctx.get(field);
};
export const is = function () {
  return _ctx.is();
};
