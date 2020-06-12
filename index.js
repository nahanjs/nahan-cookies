'use strict';

module.exports = Cookies;

function Cookies() {

    return async (ctx, next) => {
        init_cookies(ctx);
        await next();
    };
}

function init_cookies(ctx) {
    if (ctx.cookies !== undefined)
        return;

    const header = ctx.req.headers['cookie'];
    if (header === undefined)
        return;

    const cookies = header.split(';');
    for (const cookie of cookies){
        console.log(cookie);
    }
}