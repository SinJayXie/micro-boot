import * as Base from "../base";
import { Context } from "koa";

class Index extends Base.Controller {

    constructor(ctx: Context) {
        super(ctx);
    }

    public index = async () => {
        const result = await this.mysql.query('select * from c_auth_menu');
        return Base.success(result);
    }

    private static getName() {
        return 'Hello MicroBoot!';
    }
}




export = Index;
