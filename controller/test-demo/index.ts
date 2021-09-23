import * as Base from '../base';
import { Context } from 'koa';


class Index extends Base.Controller {

  constructor(ctx: Context) {
    super(ctx);
  }

  public index = async () => {
    const result = await this.mysql.query('select * from c_auth_menu');
    return Base.success(result);
  }


  public uploadView = async () => {
    return Base.render({ submitText: '点我上传文件', title: 'Upload File'});
  }

  public upload = async () => {
    Base.setMethod('POST');
    console.log(Base.getFiles());
    return Base.success('ok');
  }

  public getSystem = async () => {
    const os = require('os');
    const result: any = {};
    for (const osKey in os) {
      try {
        result[osKey] = typeof os[osKey] === 'function' ? os[osKey]() : os[osKey];
      } catch (e) {
        result[osKey] = null;
      }
    }
    return Base.success(result);
  }

  public getMethod = async () => {
    return Base.getMethod();
  }

  private static getName() {
    return 'Hello MicroBoot!';
  }
}




export = Index;
