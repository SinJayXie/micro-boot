import * as Mysql from "mysql";
import * as Config from "../config/databases";
import { Pool } from "mysql";
import * as Chalk from "../lib/chalk";
import { Context, Next } from "koa";
import Application = require("koa");

interface MysqlPool {
    readonly query: Function
}

class MysqlConn {
    private sqlService: Pool;
    constructor(con: object) {
        this.sqlService = Mysql.createPool(con);
    }
    public query = (sql: string, query: [string, any[]]): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.sqlService.query(sql, query, function (err, results, fields) {
                if(err) {
                    Chalk.error("[SQL ERROR]: " + err.code);
                    reject(err);
                } else {
                    Chalk.warn("[QUERY SQL]: " + sql)
                    resolve(results);
                }
            })
        });
    }
}

const mysql: MysqlPool = new MysqlConn(Config);

export = async (ctx: Context, next: Next) => {
    ctx.mysql = mysql;
    await next();
}
