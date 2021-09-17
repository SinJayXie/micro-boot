import {Context} from 'koa';

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
export const fail = function (msg: string): Fail {
  return {
    code: 200,
    msg,
    isSuccess: false,
    isError: true,
    timestamp: Date.now()
  };
};
