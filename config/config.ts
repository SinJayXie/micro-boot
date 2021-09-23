import { IKoaBodyOptions } from 'koa-body';
import * as path from 'path';
import * as fs from 'fs';

interface bootConfig {
  upload: IKoaBodyOptions
}
// createUpload();
// function createUpload() {
//   const dirName = path.join('/Users/assets/upload');
//   if(!fs.existsSync(dirName)) {
//     //fs.mkdirSync(dirName);
//   }
// }


const CONFIG: bootConfig = {
  upload: {
    multipart: true,
    encoding: 'gzip',
    formidable: {
      // uploadDir: path.join(__dirname, '../assets/upload'),
      keepExtensions: true,
      maxFieldsSize: 10 * 1024 * 1024,
      onFileBegin: (name,file) => {

      }
    },
    onError: async (err, ctx) => {
      ctx.throw(500 ,{ code: 500, msg: err.message, isSuccess: false, isError: true, timestamp: Date.now()});
      throw err;
    }
  }
};

export = CONFIG
