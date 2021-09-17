import * as Application from "koa";
import * as Router from "koa-router";
import * as fs from "fs";
import * as path from "path";
import * as Chalk from "./chalk";
import { Context, Next } from "koa";
import * as KoaSession from "koa-session";
import * as KoaBodyparser from "koa-bodyparser";

const projectDir: string = path.join(__dirname, '..');

/**
 * 初始化控制器
 */


const initController = function (router: Router) {
    // 遍历服务目录
    const serviceModule: string[] = fs.readdirSync(path.join(projectDir, 'controller'));
    const serviceMap: Map<any, any> = new Map();
    serviceModule.forEach((serviceName: string) => {
        // 枚举每个服务的控制器
        const controllerDir: string = path.join(projectDir, 'controller', serviceName);
        if(fs.statSync(controllerDir).isDirectory()) {
            const searchController: string[] = fs.readdirSync(controllerDir);
            const loaderList: any = {};
            searchController.forEach(controllerName => {
                // 遍历加载控制器到内存中
                loaderList[splitName(controllerName)] = loadModule(path.join(controllerDir, controllerName));
            })
            serviceMap.set(serviceName, loaderList);
        }
    })
    setRouter(serviceMap, router);
}

/**
 * 设置路由
 * @param serviceMap
 * @param router
 */
const setRouter = function (serviceMap: Map<any, any>, router: Router) {
    router.all(["/:service/:controller/:method"], async (ctx: Context, next: Next) => {
        const findService: any = serviceMap.get(ctx.params.service);
        if(findService) {
            const findController = findService[ctx.params.controller];
            try {
                const Controller = new findController(ctx);
                const fn = Controller[ctx.params.method];
                if(typeof fn === "function") {
                    ctx.response.status = 200
                    ctx.response.body = await fn();
                } else {
                    ctx.status = 404;
                    ctx.response.body = {
                        code: 404,
                        msg: `${ctx.params.method} Not found`,
                        timestamp: Date.now(),
                        path: ctx.path
                    }
                }
            } catch (e: any) {
                Chalk.error(e.stack)
                ctx.status = 500;
                ctx.body = e.stack;
            }
        }
        await next();
    });
}


/**
 * 加载控制器
 * @param path
 */
const loadModule = function (path: string) {
    try {
        return require(path);
    } catch (e: any) {
        Chalk.error(e.stack)
        return false;
    }
}

/**
 * 加载中间件
 * @param app
 */
const loadMiddleware = function (app: Application) {
    const middlewareDir: string = path.join(projectDir, 'middleware');
    const middlewareList: string[] = fs.readdirSync(middlewareDir);
    middlewareList.forEach(middleware => {
        const module: Application = loadModule(path.join(middlewareDir, middleware));
        if(typeof module === "function") app.use(module);
    })
}


/**
 * 核心功能
 * @param app
 * @param router
 * @constructor
 */
const Core = function (app: Application, router: Router) {
    app.keys = ['micro:sess'];
    const SESSION_CONFIG = {
        key: 'micro:sess',
        maxAge: 86400000,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false,
    }
    app.use(async (ctx: Context, next: Next) => {
        ctx.set("Server", "MicroBoot");
        ctx.response.status = 404
        ctx.response.body = { code: 404, msg: '404 Not found', isSuccess: false, isError: true, timestamp: Date.now(), path: ctx.path };
        Chalk.warn(`[REQUEST]: ${ctx.path} => ${ctx.ip}`);
        await next();
    })
    app.use(KoaBodyparser());
    app.use(KoaSession(SESSION_CONFIG, app));
    loadMiddleware(app);
    initController(router);
}

/**
 * 去除后缀名
 * @param name
 */
const splitName = function (name: string) {
    return name.split('.')[0];
}


export = Core;
