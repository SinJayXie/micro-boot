import { Context, Next } from "koa";

export = async (ctx: Context, next: Next) => {
    if(ctx.path.indexOf('/static/') !== -1) {
        ctx.body = ctx.path;
    } else {
        await next();
    }
}
